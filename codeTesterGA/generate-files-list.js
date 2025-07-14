import fs from 'fs/promises';
import path from 'path';

const folderPath = "./codeTesterGA";

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

// validates config.json
const emptyKeys = Object.keys(config).filter(key => {
    if (key === 'foldersToExclude') return false; // allow foldersToExclude to be empty
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

let allFilesArray = await getAllFiles(config.foldersToInclude, config.foldersToExclude, config.extensionsIncluded);

let allFiles = [];

// Get the current working directory for relative path calculation
const cwd = process.cwd();

for (const filePath of allFilesArray) {
    // Convert absolute path to relative path
    const relativePath = path.relative(cwd, filePath);

    allFiles.push({
        fileName: path.basename(filePath),
        originalPath: relativePath,  // Now this will be a relative path
        jobId: null,
        error: null,
        uri: null,
        downloaded: false
    });
}

const codeTesterFilesPath = path.join(process.cwd(), folderPath, 'codeTesterFiles.json');
try {
    await fs.access(codeTesterFilesPath);
    console.log('codeTesterFiles.json already exists, not creating, please delete the file and re-run the workflow if you want to start over.');
    process.exit(0);
} catch (err) {
    const outputPath = path.join(process.cwd(), folderPath, 'codeTesterFiles.json');
    await fs.writeFile(outputPath, JSON.stringify(allFiles, null, 2));
    console.log('codeTesterFiles.json has been saved at', outputPath);
}


