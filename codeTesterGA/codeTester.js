import fs from 'fs/promises';
import path from 'path';

const folderPath = "./codeTesterGA";

// Load configuration from config.json
const configPath = path.join(process.cwd(), folderPath + '/config.json');
let config = {};

try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
    console.log('Loaded config:', config);
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
        // If dir matches any ignoreDirs, skip it
        if (ignoreDirs.some(ignored => path.resolve(dir).endsWith(path.normalize(ignored)))) continue;

        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                // If this subdir matches any ignoreDirs, skip it
                if (ignoreDirs.some(ignored => path.resolve(fullPath).endsWith(path.normalize(ignored)))) continue;
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

for (const filePath of allFilesArray) {
    allFiles.push({
        fileName: path.basename(filePath),
        originalPath: filePath,
        jobId: null,
        error: null,
        downloaded: false
    });
}

const outputPath = path.join(process.cwd(), folderPath, 'codeTesterFiles.json');
await fs.writeFile(outputPath, JSON.stringify(allFiles, null, 2));
console.log('codeTesterFiles.json has been saved at', outputPath);

