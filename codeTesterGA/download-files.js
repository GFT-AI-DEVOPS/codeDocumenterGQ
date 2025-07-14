import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const folderPath = "./codeTesterGA";

const jsonFilePath = path.join(process.cwd(), folderPath + '/codeTesterFiles.json');

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
        `http://api.gftaiimpact.local/ai/jobs/${jobId}/status`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return res;
}

// Placeholder for download function
async function downloadFile(item) {
    console.log(`Downloading file for jobId: ${item.jobId}`);
    try {
        const fileResponse = await axios.get(
            `http://api.gftaiimpact.local${item.uri}`,
            {
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            });

        const baseDir = config.testsFolder;
        const targetPath = path.join(baseDir, path.relative(process.cwd(), item.originalPath));
        // console.log(`Target path for download: ${targetPath}`);

        await fsP.mkdir(path.dirname(targetPath), { recursive: true });

        await fsP.writeFile(targetPath, fileResponse.data);

        item.downloaded = true;
        console.log(`File downloaded successfully: ${targetPath}`);
        // writeJsonFile(jsonFilePath, files);

    } catch (err) {
        console.log(err)
        item.error = err.response?.headers || 'Unknown download error.';
        // writeJsonFile(jsonFilePath, files);
    }
}

async function processFiles() {

    for (let item of files) {
        // console.log(item);
        if (
            item.jobId &&
            item.downloaded === false &&
            item.error === null
        ) {
            try {
                const res = await fetchJobStatus(item.jobId);

                if (res.data.status === 'Completed') {
                    item.uri = res.data.results[0].output[0].uri;
                    await downloadFile(item);
                    writeJsonFile(jsonFilePath, files);
                } else if (res.data.status === 'Running') {
                    continue;
                } else {
                    item.error = res.data.errors || 'Unknown error.';
                    writeJsonFile(jsonFilePath, files);
                }
            } catch (err) {
                console.log(err.message);
                item.error = err.response?.headers || 'Unknown job status error.';
                writeJsonFile(jsonFilePath, files);
            }
            // Wait 1 second before next iteration
            await new Promise(resolve => setTimeout(resolve, 500));
        } else if (item.downloaded === true) {
            console.log(`File already downloaded: ${item.uri}, skipping...`);
        }
    }
}

processFiles();