import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const folderPath = "./codeTesterGA";

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
    console.log("Reading: " + path.join(process.cwd(), folderPath + '/codeTesterFiles.json'))
    allFilesArray = JSON.parse(await fs.readFile(path.join(process.cwd(), folderPath + '/codeTesterFiles.json'), 'utf-8'));
} catch (err) {
    console.error('Could not read or parse codeTesterFiles.json:', err.message);
    process.exit(1);
};


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendFiles(allFilesArray) {
    for (const [index, element] of allFilesArray.entries()) {
        if (element.jobId === null || (element.jobId !== null && element.error !== null)) {
            await delay(index * 250);

            console.log(`Sending file: ${element.fileName}`);

            const ext = path.extname(element.fileName).toLowerCase();
            const language = Object.prototype.hasOwnProperty.call(config.extensionToLanguage, ext) ? config.extensionToLanguage[ext] : null;

            if (language === null) {
                console.error(`No language mapping found for extension: ${ext}`);
                element.error = `No language mapping found for extension: ${ext}`;
                await fs.writeFile(
                    path.join(process.cwd(), folderPath + '/codeTesterFiles.json'),
                    JSON.stringify(allFilesArray, null, 2),
                    'utf-8'
                );
            } else {
                const fileBuffer = await fs.readFile(element.originalPath);

                const form = new FormData();
                form.append('RunName', 'GenerateTests');
                form.append('jobName', 'DemoTestCreator');
                form.append('TestType', 'Unit');
                form.append('TestingFrameworks', config.testFrameworks[`${path.extname(element.fileName).toLowerCase()}`]);
                form.append('SourceCodeLanguage', language);
                form.append('PromptId', config.promptId);
                form.append('Llm', config.llm);
                form.append('AdditionalInstructions', config.additionalInstructions);
                form.append('files', fileBuffer, element.fileName);

                try {
                    const response = await axios.post(
                        'http://api.gftaiimpact.local/ai/test',
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
                    await fs.writeFile(
                        path.join(process.cwd(), folderPath + '/codeTesterFiles.json'),
                        JSON.stringify(allFilesArray, null, 2),
                        'utf-8'
                    );
                    console.log("Response data:", response.data);

                } catch (err) {
                    element.error = `Error sending file: ${err?.response?.data ? JSON.stringify(err.response.data) : err.message}`;
                    console.error("Error sending file:", err.message);
                    await fs.writeFile(
                        path.join(process.cwd(), folderPath + '/codeTesterFiles.json'),
                        JSON.stringify(allFilesArray, null, 2),
                        'utf-8'
                    );
                }
            }
        } else {
            console.log(`File already sent: ${element.fileName} with jobId: ${element.jobId}, skipping...`);
        }
    }
}

// Change the function call to await it:
await sendFiles(allFilesArray);