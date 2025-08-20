import fs from 'fs/promises';
import path from 'path';

const folderPath = "./codeDocumenter";
// Load configuration from config.json
const configPath = path.join(process.cwd(), folderPath + '/config.json');
let config = {};

try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
    console.log('Loaded config file');
} catch (err) {
    console.error('Could not read or parse config.json:', err.message);
}

const tokenLimit = config.maxTokens || 4096; // Default to 4096 if not set in config

// validates config.json
const emptyKeys = Object.keys(config).filter(key => {
    // allow foldersToExclude, maxFilesLimit, and additionalInstructions to be empty
    if (['foldersToExclude', 'maxFilesLimit', 'additionalInstructions'].includes(key)) return false;
    const value = config[key];
    return value === undefined || value === null || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
});

if (emptyKeys.length > 0) {
    console.error('Config has empty key(s):', emptyKeys);
    process.exit(1);
} else {
    console.log('Config validation passed: no empty keys (except foldersToExclude).');
}

async function estimateTokens(fileContent) {

    fileContent = await fs.readFile(fileContent, 'utf8');

    if (!fileContent || typeof fileContent !== 'string') return 0;

    // Remove extra whitespace and normalize
    const normalizedText = fileContent.replace(/\s+/g, ' ').trim();

    // Rough estimation: 1 token ≈ 4 characters for most languages
    return Math.ceil(normalizedText.length / 4);
}

async function getAllFiles(dirs, ignoreDirs, includedExt) {
    let files = [];
    for (const dir of Array.isArray(dirs) ? dirs : [dirs]) {
        // Convert relative dir to absolute path
        const absDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);

        // If absDir matches any ignoreDirs, skip it
        if (ignoreDirs.some(ignored => absDir.endsWith(path.normalize(ignored)))) continue;

        const entries = await fs.readdir(absDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(absDir, entry.name);
            if (entry.isDirectory()) {
                // If this subdir matches any ignoreDirs, skip it
                if (ignoreDirs.some(ignored => fullPath.endsWith(path.normalize(ignored)))) continue;
                files = files.concat(await getAllFiles([fullPath], ignoreDirs, includedExt));
            } else {
                const ext = path.extname(fullPath);
                if (includedExt.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }
    return files;
}

let allFilesArray = await getAllFiles([config.folderToInclude], config.foldersToExclude, config.extensionsIncluded);
if (config.maxFilesLimit && allFilesArray.length > config.maxFilesLimit) {
    console.warn(`Warning: The number of files (${allFilesArray.length}) exceeds the maxFilesLimit (${config.maxFilesLimit}). Only the first ${config.maxFilesLimit} files will be processed.`);
    allFilesArray = allFilesArray.slice(0, config.maxFilesLimit);
}
let allFiles = [];

// Get the current working directory for relative path calculation
const cwd = process.cwd();

for (const filePath of allFilesArray) {
    // Convert absolute path to relative path
    // const relativePath = path.relative(cwd, filePath);

    const tokens = await estimateTokens(filePath); // Returns 8

    allFiles.push({
        fileName: path.basename(filePath),
        originalPath: filePath,  // Now this will be a relative path
        jobId: null,
        error: tokens > tokenLimit ? `Exceeded token limit ${tokens}/${tokenLimit}` : null,
        uri: null,
        downloaded: false,
        tokens: tokens
    });

}

let fileName = 'codeDocumenterFiles.json'

if (config?.type == "agile") {
    fileName = 'storyCreatorFiles.json'
}

const codeDocumenterFilesPath = path.join(process.cwd(), folderPath, fileName);
try {
    await fs.access(codeDocumenterFilesPath);
    console.log(fileName + ' already exists, not creating, please delete the file and re-run the workflow if you want to start over.');
    process.exit(0);
} catch (err) {
    const outputPath = path.join(process.cwd(), folderPath, fileName);
    await fs.writeFile(outputPath, JSON.stringify(allFiles, null, 2));
    console.log(fileName + ' has been saved at', outputPath);
}


