import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const API_URL = process.env.API_URL;

const folderPath = "./codeDocumenter";

const jsonFilePath = path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json');

const configPath = path.join(process.cwd(), folderPath + '/config.json');

let files = readJsonFile(jsonFilePath);

let config = {};

try {
    const configContent = await fsP.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
    // console.log('Loaded config:', config);
} catch (err) {
    console.error('Could not read or parse config.json:', err.message);
}

// Helper to read JSON file
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper to write JSON file
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Placeholder for API request
async function fetchJobStatus(jobId) {
    const res = await axios.get(
        API_URL + `/ai/jobs/${jobId}/status`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return res;
}

async function downloadFile(item) {
    const downloadedCount = files.filter(f => f.downloaded).length;
    console.log(`Downloading file for jobId(${downloadedCount}/${files.length}): ${item.jobId}`);
    try {
        const fileResponse = await axios.get(
            API_URL + `${item.uri}`,
            {
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            });

        const baseDir = config.docsFolder;
        const promptFolder = config.promptId;

        const baseFolderToInclude = config.folderToInclude; // "C:/Programas_GO_Tratados"

        // Get the folder name to preserve it in the path
        const baseFolderName = path.basename(baseFolderToInclude); // "Programas_GO_Tratados"

        // Get the relative path from the base folder
        const relativePath = path.relative(baseFolderToInclude, item.originalPath);

        // Combine base folder name + relative path
        const fullRelativePath = path.join(baseFolderName, relativePath);

        const targetPath = path.join(baseDir, promptFolder, fullRelativePath) + '.md';

        // console.log(`Base folder: ${baseFolderToInclude}`);
        // console.log(`Base folder name: ${baseFolderName}`);
        // console.log(`Original path: ${item.originalPath}`);
        // console.log(`Relative path: ${relativePath}`);
        // console.log(`Full relative path: ${fullRelativePath}`);
        // console.log(`Target path: ${targetPath}`);

        await fsP.mkdir(path.dirname(targetPath), { recursive: true });
        await fsP.writeFile(targetPath, fileResponse.data);

        item.downloaded = true;
        console.log(`File downloaded successfully: ${targetPath}`);

    } catch (err) {
        console.log(err)
        item.error = err.response?.headers || err.response?.data || err.message || 'Unknown download error.';
    }
}

const delayTime = 3000
async function processFiles() {
    let pending = true;

    while (pending) {
        pending = false;

        for (let item of files) {
            if (
                item.jobId
                && item.downloaded === false
                && item.error === null
            ) {
                pending = true;
                try {
                    const res = await fetchJobStatus(item.jobId);
                    console.log(item.jobId, item.fileName);
                    console.log(res.data.status);
                    if (res.data.status === 'Completed') {
                        item.uri = res.data.results[0].output[0].uri;
                        await downloadFile(item);
                        writeJsonFile(jsonFilePath, files);
                    } else if (res.data.status === 'Running') {
                        // continue;
                    } else {
                        console.log(res.data.errors || 'Unknown error.')
                        item.error = res.data.errors || 'Unknown error.';
                        writeJsonFile(jsonFilePath, files);
                    }
                } catch (err) {
                    console.log("Error: ", err.response?.data || err || 'Unknown job status error.');
                    item.error = err.response?.data || err || 'Unknown job status error.';
                    writeJsonFile(jsonFilePath, files);
                }
                // Small delay between individual requests
                await new Promise(resolve => setTimeout(resolve, delayTime));

            }
        }

    }
    console.log('All files processed.');
    console.log('Please check the codeDocumenterFiles.json file for the results.');
}

processFiles();