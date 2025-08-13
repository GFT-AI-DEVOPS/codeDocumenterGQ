import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_URL = process.env.API_URL;

const folderPath = "./codeDocumenter";

// Load configuration from config.json
const configPath = path.join(process.cwd(), folderPath + '/config.json');
let config = {};
let allFilesArray = [];

try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configContent);
    // console.log('Loaded config:', config);
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
};

try {
    console.log("Reading: " + path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json'))
    // allFilesArray = JSON.parse(await fs.readFile(path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json'), 'utf-8')).slice(0, 1);
    allFilesArray = JSON.parse(await fs.readFile(path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json'), 'utf-8'))
} catch (err) {
    console.error('Could not read or parse codeDocumenterFiles.json:', err.message);
    process.exit(1);
};


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const tokenLimit = config.maxTokens || 4096; // Default to 4096 if not set in config

async function sendFiles(allFilesArray) {
    for (const [index, element] of allFilesArray.entries()) {
        if ((element.jobId === null || (element.jobId !== null && element.error !== null)) && !(element.tokens > tokenLimit)) {
            // Rate limiting: 20 RPM = 1 request every 3 seconds
            console.log(element.fileName, element.tokens);
            let delayTime = 1000;
            if (index > 0) {
                console.log(`Waiting ${delayTime / 1000} seconds to respect rate limit...`);
                await delay(delayTime);
            }

            console.log(`Sending file (${index + 1}/${allFilesArray.length}) - ETA: ${Math.ceil((allFilesArray.length - index) * delayTime / 1000)} seconds`);

            const ext = path.extname(element.fileName).toLowerCase();
            const language = config.noExtensionOverride.active
                ? Object.prototype.hasOwnProperty.call(config.extensionToLanguage, config.noExtensionOverride.extensionToUse) ? config.extensionToLanguage[config.noExtensionOverride.extensionToUse] : null
                : Object.prototype.hasOwnProperty.call(config.extensionToLanguage, ext) ? config.extensionToLanguage[ext] : null;

            if (language === null) {
                console.error(`No language mapping found for extension: ${ext}`);
                element.error = `No language mapping found for extension: ${ext}`;
                await fs.writeFile(
                    path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json'),
                    JSON.stringify(allFilesArray, null, 2),
                    'utf-8'
                );
            } else {
                const fileBuffer = await fs.readFile(element.originalPath);

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
                form.append('files', fileBuffer, element.fileName);

                // Retry logic for rate limiting
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

                        element.jobId = response.data;
                        element.error = null;
                        success = true; // Mark as successful

                        console.log("Response data:", response.data);

                    } catch (err) {
                        retryCount++;

                        if (err?.response?.status === 429) {
                            if (retryCount < maxRetries) {
                                const waitTime = 60000 * retryCount; // Progressive wait: 60s, 120s, 180s
                                console.log(`Rate limit hit! Retry ${retryCount}/${maxRetries} - Waiting ${waitTime / 1000} seconds...`);
                                await delay(waitTime);
                            } else {
                                console.log(`Max retries reached for ${element.fileName}`);
                                element.error = `Rate limit exceeded after ${maxRetries} retries`;
                            }
                        } else {
                            // Non-rate-limit error - don't retry
                            console.log(`Non-rate-limit error for ${element.fileName}`);
                            const errorMessage = err?.response?.data || err.message;
                            element.error = `Error sending file: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`;
                            console.error("Error sending file:", errorMessage);
                            console.error("Full error details:", {
                                status: err?.response?.status,
                                statusText: err?.response?.statusText,
                                data: err?.response?.data
                            });
                            break; // Exit retry loop for non-rate-limit errors
                        }
                    }
                }

                // Save progress after each file (success or final failure)
                await fs.writeFile(
                    path.join(process.cwd(), folderPath + '/codeDocumenterFiles.json'),
                    JSON.stringify(allFilesArray, null, 2),
                    'utf-8'
                );
            }

        } else if (element.tokens > tokenLimit) {
            console.log(`File exceeded token limit(${element.tokens}/${tokenLimit}): ${element.fileName}, skipping...`);
        } else {
            console.log(`File already sent: ${element.fileName} with jobId: ${element.jobId}, skipping...`);
        }
    }
}

// Change the function call to await it:
await sendFiles(allFilesArray);