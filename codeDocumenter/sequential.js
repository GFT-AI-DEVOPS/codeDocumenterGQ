import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_URL = process.env.API_URL;

const folderPath = "./codeDocumenter";
const jsonFilePath = path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json');
const configPath = path.join(process.cwd(), folderPath + '/config.json');

function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let config = {};
let files = [];

try {
    const configContent = await fsP.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
} catch (err) {
    console.error('Could not read or parse config.json:', err.message);
    process.exit(1);
}

try {
    files = readJsonFile(jsonFilePath);
} catch (err) {
    console.error('Could not read or parse codeDocumenterFiles.json:', err.message);
    process.exit(1);
}

const tokenLimit = config.maxTokens || 4096;
const delayTime = 5000;

async function fetchJobStatus(jobId) {
    const res = await axios.get(
        API_URL + `/ai/jobs/${jobId}/status`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return res;
}

async function sendFile(item) {
    const ext = path.extname(item.fileName).toLowerCase();
    const language = config.noExtensionOverride?.active
        ? config.extensionToLanguage[config.noExtensionOverride.extensionToUse] ?? null
        : config.extensionToLanguage[ext] ?? null;

    if (language === null) {
        console.error(`No language mapping found for extension: ${ext}`);
        item.error = `No language mapping found for extension: ${ext}`;
        writeJsonFile(jsonFilePath, files);
        return false;
    }

    const fileBuffer = await fsP.readFile(item.originalPath);

    const form = new FormData();
    form.append('RunName', config.RunName);
    form.append('jobName', config.jobName);
    form.append('DocumentationFormat', config.DocumentationFormat);
    form.append('DiagramFormat', config.DiagramFormat);
    form.append('SourceCodeLanguage', language);
    form.append('DocumentationAudience', config.DocumentationAudience);
    form.append('PromptId', config.promptId);
    form.append('TargetExtension', config.TargetExtension);
    form.append('Llm', config.llm);
    form.append('AdditionalInstructions', config.additionalInstructions);
    form.append('files', fileBuffer, item.fileName);

    let success = false;
    let retryCount = 0;
    const maxRetries = 3;

    while (!success && retryCount < maxRetries) {
        try {
            const response = await axios.post(
                API_URL + "/ai/document",
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );
            item.jobId = response.data;
            item.error = null;
            success = true;
            writeJsonFile(jsonFilePath, files);
            return true;
        } catch (err) {
            retryCount++;
            if (err?.response?.status === 429) {
                if (retryCount < maxRetries) {
                    const waitTime = 60000 * retryCount;
                    console.log(`Rate limit hit! Retry ${retryCount}/${maxRetries} - Waiting ${waitTime / 1000} seconds...`);
                    await delay(waitTime);
                } else {
                    console.log(`Max retries reached for ${item.fileName}`);
                    item.error = `Rate limit exceeded after ${maxRetries} retries`;
                    writeJsonFile(jsonFilePath, files);
                    return false;
                }
            } else {
                const errorMessage = err?.response?.data || err.message;
                item.error = `Error sending file: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`;
                writeJsonFile(jsonFilePath, files);
                return false;
            }
        }
    }
}

async function downloadFile(item) {
    try {
        const fileResponse = await axios.get(
            API_URL + `${item.uri}`,
            {
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            });

        const baseDir = config.docsFolder;
        const promptFolder = config.promptId;
        const baseFolderToInclude = config.folderToInclude;
        const baseFolderName = path.basename(baseFolderToInclude);
        const relativePath = path.relative(baseFolderToInclude, item.originalPath);
        const fullRelativePath = path.join(baseFolderName, relativePath);
        const targetPath = path.join(baseDir, promptFolder, fullRelativePath) + '.md';

        await fsP.mkdir(path.dirname(targetPath), { recursive: true });
        await fsP.writeFile(targetPath, fileResponse.data);

        item.downloaded = true;
        console.log(`File downloaded successfully: ${targetPath}`);
    } catch (err) {
        item.error = err.response?.headers || err.response?.data || err.message || 'Unknown download error.';
        writeJsonFile(jsonFilePath, files);
    }
}

async function processFile(item) {
    if (item.tokens > tokenLimit) {
        console.log(`File exceeded token limit(${item.tokens}/${tokenLimit}): ${item.fileName}, skipping...`);
        return;
    }
    if (item.downloaded) {
        console.log(`File already downloaded: ${item.fileName}, skipping...`);
        return;
    }

    // Step 1: Send if needed
    let sendStartTime;
    if (!item.jobId || item.error) {
        console.log(`Sending file: ${item.fileName}`);
        sendStartTime = Date.now();
        const sent = await sendFile(item);
        if (!sent) return;
    } else {
        sendStartTime = Date.now();
    }

    // Step 2: Poll status until completed
    let tries = 0;
    const maxTries = 120;
    let completed = false;
    while (tries < maxTries) {
        try {
            const res = await fetchJobStatus(item.jobId);
            const status = res.data.status;
            if (status === 'Running') {
                console.log(`status: Running (${item.fileName})`);
                await delay(delayTime);
            } else {
                console.log(`status: ${status}`);
            }
            if (status === 'Completed') {
                item.uri = res.data.results[0].output[0].uri;
                completed = true;
                break;
            } else if (status !== 'Running') {
                item.error = res.data.errors || 'Unknown error.';
                writeJsonFile(jsonFilePath, files);
                break;
            }
        } catch (err) {
            item.error = err.response?.data || err || 'Unknown job status error.';
            writeJsonFile(jsonFilePath, files);
            break;
        }
        tries++;
    }
    if (!completed) {
        item.error = item.error || 'Job did not complete in time.';
        writeJsonFile(jsonFilePath, files);
        return;
    }

    // Step 3: Download
    console.log(`Downloading file: ${item.fileName}`);
    await downloadFile(item);
    writeJsonFile(jsonFilePath, files);

    // Step 4: Log time and tokens
    const elapsedSeconds = ((Date.now() - sendStartTime) / 1000).toFixed(2);
    console.log(`Time elapsed for ${item.fileName}: ${elapsedSeconds} seconds, tokens: ${item.tokens}`);

    // Step 5: Finished log
    console.log(`Finished processing: ${item.fileName}\n`);
}

async function processFilesWithConcurrency() {
    const concurrency = config.sequentialConcurrency || 1;
    let index = 0;
    while (index < files.length) {
        const batch = files.slice(index, index + concurrency);
        await Promise.all(batch.map(item => processFile(item)));
        index += concurrency;
    }
    console.log('All files processed with concurrency.');
    console.log('Please check the codeDocumenterFiles.json file for the results.');

    // Save a copy of codeDocumenterFiles.json in the download folder
    const downloadFolder = path.join(config.docsFolder, config.promptId);
    const targetJsonPath = path.join(downloadFolder, 'codeDocumenterFiles.json');
    await fsP.mkdir(downloadFolder, { recursive: true });
    await fsP.copyFile(jsonFilePath, targetJsonPath);
    console.log(`Saved a copy of codeDocumenterFiles.json to: ${targetJsonPath}`);
}

await processFilesWithConcurrency();