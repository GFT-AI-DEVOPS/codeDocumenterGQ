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
const jsonFilePath = path.join(process.cwd(), folderPath + '/storyCreatorFiles.json');
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
    console.error('Could not read or parse storyCreatorFiles.json:', err.message);
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

function splitMarkdownSectionsWithRules(markdownText) {
    const sectionRegex = /^## (.+)$/gm;
    const sections = {};
    const titles = [];
    let match;

    // Encontra todas as seções principais
    while ((match = sectionRegex.exec(markdownText)) !== null) {
        titles.push({ title: match[1].trim(), index: match.index });
    }

    for (let i = 0; i < titles.length; i++) {
        const start = titles[i].index;
        const end = i + 1 < titles.length ? titles[i + 1].index : markdownText.length;
        const sectionName = titles[i].title;
        let sectionContent = markdownText.slice(start, end).trim();

        // Se for Detailed Rules, subdivide pelas regras internas
        if (sectionName.toLowerCase() === 'detailed rules') {
            const ruleRegex = /\*\*\d+\.\s*Rule:[^\n]*\n([\s\S]*?)(?=(\*\*\d+\. Rule:|<!-- rule-end -->|$))/g;
            const rules = {};
            let ruleMatch;
            while ((ruleMatch = ruleRegex.exec(sectionContent)) !== null) {
                // Extrai o nome da regra (primeira linha após "**N. Rule:")
                const ruleTitleMatch = ruleMatch[0].match(/\*\*\d+\.\s*Rule:\s*([^\n]*)/);
                const ruleTitle = ruleTitleMatch
                    ? ruleTitleMatch[1].replace(/^\*+|\*+$/g, '').trim()
                    : `Rule ${ruleMatch[0]}`;
                rules[ruleTitle] = ruleMatch[0].trim();
            }
            sections[sectionName] = rules;
        } else {
            sections[sectionName] = sectionContent;
        }
    }

    return sections;
}

// Exemplo de uso:
// const fs = require('fs');
// const path = 'c:\\Users\\artu\\OneDrive - GFT Technologies SE\\Documents\\AI Impact\\codeDocumenterGQ\\generatedDocs\\LegacyTransformer__Business_Rules\\Programas_GO_Tratados\\GO502A37.md';



// async function sendFile(item) {
//     const ext = path.extname(item.fileName).toLowerCase();
//     const language = config.noExtensionOverride?.active
//         ? config.extensionToLanguage[config.noExtensionOverride.extensionToUse] ?? null
//         : config.extensionToLanguage[ext] ?? null;

//     if (language === null) {
//         console.error(`No language mapping found for extension: ${ext}`);
//         item.error = `No language mapping found for extension: ${ext}`;
//         writeJsonFile(jsonFilePath, files);
//         return false;
//     }

//     const fileBuffer = await fsP.readFile(item.originalPath);

//     const form = new FormData();
//     form.append('RunName', config.RunName);
//     form.append('jobName', config.jobName);
//     // form.append('DocumentationFormat', config.DocumentationFormat);
//     // form.append('DiagramFormat', config.DiagramFormat);
//     // form.append('SourceCodeLanguage', language);
//     // form.append('DocumentationAudience', config.DocumentationAudience);
//     form.append('PromptId', config.promptId);
//     // form.append('TargetExtension', config.TargetExtension);
//     form.append('Llm', config.llm);
//     form.append('Conventions', 'StoryLevelName_V1');
//     form.append('LevelTypeId', 'UserStory');
//     form.append('ProjectId', 'PoC - Agile');
//     form.append('RequestTitle', '');
//     form.append('RequestDescription', '');
//     form.append('AdditionalInstructions', config.additionalInstructions);
//     // form.append('files', fileBuffer, item.fileName);

//     let success = false;
//     let retryCount = 0;
//     const maxRetries = 3;

//     while (!success && retryCount < maxRetries) {
//         try {
//             const response = await axios.post(
//                 API_URL + "/bff/agile/preview",
//                 form,
//                 {
//                     headers: {
//                         ...form.getHeaders(),
//                         Authorization: `Bearer ${ACCESS_TOKEN}`,
//                     },
//                 }
//             );
//             item.jobId = response.data;
//             item.error = null;
//             success = true;
//             writeJsonFile(jsonFilePath, files);
//             return true;
//         } catch (err) {
//             retryCount++;
//             if (err?.response?.status === 429) {
//                 if (retryCount < maxRetries) {
//                     const waitTime = 60000 * retryCount;
//                     console.log(`Rate limit hit! Retry ${retryCount}/${maxRetries} - Waiting ${waitTime / 1000} seconds...`);
//                     await delay(waitTime);
//                 } else {
//                     console.log(`Max retries reached for ${item.fileName}`);
//                     item.error = `Rate limit exceeded after ${maxRetries} retries`;
//                     writeJsonFile(jsonFilePath, files);
//                     return false;
//                 }
//             } else {
//                 const errorMessage = err?.response?.data || err.message;
//                 item.error = `Error sending file: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`;
//                 writeJsonFile(jsonFilePath, files);
//                 return false;
//             }
//         }
//     }
// }

// async function downloadFile(item) {
//     try {
//         const fileResponse = await axios.get(
//             API_URL + `${item.uri}`,
//             {
//                 headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
//             });

//         const baseDir = config.docsFolder;
//         const promptFolder = config.promptId;
//         const baseFolderToInclude = config.folderToInclude;
//         const baseFolderName = path.basename(baseFolderToInclude);
//         const relativePath = path.relative(baseFolderToInclude, item.originalPath);
//         const fullRelativePath = path.join(baseFolderName, relativePath);
//         const targetPath = path.join(baseDir, promptFolder, fullRelativePath) + '.md';

//         await fsP.mkdir(path.dirname(targetPath), { recursive: true });
//         await fsP.writeFile(targetPath, fileResponse.data);

//         item.downloaded = true;
//         console.log(`File downloaded successfully: ${targetPath}`);
//     } catch (err) {
//         item.error = err.response?.headers || err.response?.data || err.message || 'Unknown download error.';
//         writeJsonFile(jsonFilePath, files);
//     }
// }

async function waitForJobCompletion(jobId, sectionName, fileName, delayTime = 5000, maxAttempts = 60) {
    let attempts = 0;
    while (attempts < maxAttempts) {
        try {
            const response = await fetchJobStatus(jobId);
            const status = response.data?.status || response.data?.jobStatus;
            logJobStatus(jobId, attempts + 1, status, sectionName, fileName);

            if (isJobCompleted(status)) {
                logJobCompletion(jobId, sectionName, fileName, status);
                return { status, result: response.data };
            }
            if (isJobError(status)) {
                logJobError(jobId, sectionName, fileName, status);
                return { status, result: response.data };
            }
        } catch (error) {
            logJobFetchError(jobId, sectionName, fileName, error);
        }
        await delay(delayTime);
        attempts++;
    }
    throw new Error(`Job ${jobId} did not complete after ${maxAttempts} attempts (Section: ${sectionName}, File: ${fileName})`);
}

function logJobStatus(jobId, attempt, status, sectionName, fileName) {
    console.log(`Job ${jobId}: attempt ${attempt}, status: ${status} | Section: ${sectionName} | File: ${fileName}`);
}

function logJobCompletion(jobId, sectionName, fileName, status) {
    console.log(`Job ${jobId} completed with status "${status}" for section "${sectionName}" in file "${fileName}".`);
}

function logJobError(jobId, sectionName, fileName, status) {
    console.error(`Job ${jobId} completed with error status "${status}" for section "${sectionName}" in file "${fileName}".`);
}

function logJobFetchError(jobId, sectionName, fileName, error) {
    console.error(`Error fetching status for job ${jobId} (Section: ${sectionName}, File: ${fileName}): ${error.message}`);
}

function isJobCompleted(status) {
    return status === "completed" || status === "Completed";
}

function isJobError(status) {
    return status === "CompletedWithErrors" || status === "failed" || status === "error";
}

async function processFile(item) {
    const fileBaseName = path.basename(item.fileName, path.extname(item.fileName));
    const outputDir = path.join(config.docsFolder, fileBaseName);
    await fsP.mkdir(outputDir, { recursive: true });

    const data = await fsP.readFile(item.originalPath, 'utf8');
    const result = splitMarkdownSectionsWithRules(data);

    if (!item.jobIds) item.jobIds = {};

    for (const [section, value] of Object.entries(result)) {
        if (section === "Detailed Rules" && typeof value === "object") {
            if (!item.jobIds[section]) item.jobIds[section] = {};
            for (const [ruleName, ruleContent] of Object.entries(value)) {
                const jobInfo = item.jobIds[section][ruleName];
                const shouldRetry = !jobInfo || isJobError(jobInfo.status) || !jobInfo.status;

                if (!shouldRetry) continue; // Skip if already succeeded

                const cleanContent = ruleContent.replace(/<!--[\s\S]*?-->/g, '');
                console.log(`Retrying section: ${section} > ${ruleName}`);

                const jobId = await sendSectionAndGetJobId(cleanContent, ruleName, item);
                item.jobIds[section][ruleName] = { jobId };
                writeJsonFile(jsonFilePath, files);

                const { status, result: jobResult } = await waitForJobCompletion(jobId, ruleName, item.fileName);
                item.jobIds[section][ruleName].status = status;
                if (status === "CompletedWithErrors") {
                    item.jobIds[section][ruleName].error = jobResult?.error || JSON.stringify(jobResult);
                }
                if (status === "Completed") {
                    const uri = jobResult?.results?.[0]?.output?.[0]?.uri;
                    if (uri) item.jobIds[section][ruleName].uri = uri;
                }
                writeJsonFile(jsonFilePath, files);

                const safeName = ruleName.replace(/[\\/:*?"<>|]/g, "_");
                await fsP.writeFile(path.join(outputDir, `${safeName}.md`), cleanContent);
            }
        } else {
            const jobInfo = item.jobIds[section];
            const shouldRetry = !jobInfo || isJobError(jobInfo.status) || !jobInfo.status;

            if (!shouldRetry) continue; // Skip if already succeeded

            const cleanContent = value.replace(/<!--[\s\S]*?-->/g, '');
            console.log(`Retrying section: ${section}`);

            const jobId = await sendSectionAndGetJobId(cleanContent, section, item);
            item.jobIds[section] = { jobId };
            writeJsonFile(jsonFilePath, files);

            const { status, result: jobResult } = await waitForJobCompletion(jobId, section, item.fileName);
            item.jobIds[section].status = status;
            if (status === "CompletedWithErrors") {
                item.jobIds[section].error = jobResult?.error || JSON.stringify(jobResult);
            }
            if (status === "Completed") {
                const uri = jobResult?.results?.[0]?.output?.[0]?.uri;
                if (uri) item.jobIds[section].uri = uri;
            }
            writeJsonFile(jsonFilePath, files);

            const safeName = section.replace(/[\\/:*?"<>|]/g, "_");
            await fsP.writeFile(path.join(outputDir, `${safeName}.md`), cleanContent);
        }
    }

    // After all sections processed, for each section without errors:
    for (const [section, jobInfo] of Object.entries(item.jobIds)) {
        if (section === "Detailed Rules" && typeof jobInfo === "object") {
            for (const [ruleName, ruleJobInfo] of Object.entries(jobInfo)) {
                await processSectionDetails(item, ruleName, ruleJobInfo);
            }
        } else {
            await processSectionDetails(item, section, jobInfo);
        }
    }

    item.downloaded = true;
    writeJsonFile(jsonFilePath, files);
    console.log(`All error sections retried and jobIds saved for: ${item.fileName}`);
}

// Função para enviar e retornar jobId
async function sendSectionAndGetJobId(content, sectionName, item) {
    const form = new FormData();
    form.append('RunName', config.RunName);
    form.append('jobName', config.jobName);
    form.append('PromptId', config.promptId);
    form.append('Conventions', 'StoryLevelName_V1');
    form.append('LevelTypeId', 'UserStory');
    form.append('ProjectId', 'PoC - Agile');
    form.append('RequestTitle', sectionName);
    // console.log('Sending section content:', content);
    form.append('RequestDescription', content);
    form.append('ResponseLanguage', config.ResponseLanguage);
    form.append('AdditionalInstructions', config.additionalInstructions);

    try {
        const response = await axios.post(
            API_URL + "/bff/agile/preview",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );
        // Retorna o jobId da resposta
        return response.data;
    } catch (err) {
        return `Error: ${err?.response?.data || err.message}`;
    }
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
    console.log('Please check the storyCreatorFiles.json file for the results.');

    // Save a copy of storyCreatorFiles.json in the download folder
    const downloadFolder = path.join(config.docsFolder, config.promptId);
    const targetJsonPath = path.join(downloadFolder, 'storyCreatorFiles.json');
    await fsP.mkdir(downloadFolder, { recursive: true });
    await fsP.copyFile(jsonFilePath, targetJsonPath);
    console.log(`Saved a copy of storyCreatorFiles.json to: ${targetJsonPath}`);
}

await processFilesWithConcurrency();

async function processSectionDetails(item, section, jobInfo) {
    if (!jobInfo || jobInfo.status !== "Completed" || !jobInfo.jobId) return;

    // Ensure the jobIds structure exists
    if (!item.jobIds) item.jobIds = {};
    if (!item.jobIds[section]) item.jobIds[section] = jobInfo;

    // 1. Call process-definition endpoint
    const processDefUrl = `${API_URL}/bff/agile/process-definition/${jobInfo.jobId}`;
    const processDefResp = await axios.get(processDefUrl, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    item.jobIds[section].processDefinition = processDefResp.data;
    writeJsonFile(jsonFilePath, files);

    // 2. For each object in processDefinition, call work-item detail endpoint
    for (const obj of processDefResp.data) {
        const detailUrl = `${API_URL}/bff/agile/work-item/${obj.id}/detail`;
        const detailResp = await axios.get(detailUrl, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });
        // Save detail response under the section, keyed by work-item id
        if (!item.jobIds[section].workItemDetails) item.jobIds[section].workItemDetails = {};
        item.jobIds[section].workItemDetails[obj.id] = detailResp.data;
        writeJsonFile(jsonFilePath, files);

        // Save the work item detail as .md
        const mdFileName = `${section}_${obj.id}_detail`;
        await saveWorkItemDetailAsMd(detailResp.data, path.join(config.docsFolder, path.basename(item.fileName, path.extname(item.fileName))), mdFileName);
    }
}


// Função para converter o JSON em Markdown simples
function jsonToMarkdown(obj) {
    let md = '';
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            md += `## ${key}\n${jsonToMarkdown(value)}\n`;
        } else {
            md += `- **${key}**: ${value}\n`;
        }
    }
    return md;
}

// Exemplo de uso após receber o retorno da API:
async function saveWorkItemDetailAsMd(detailJson, outputDir, fileName) {
    const mdContent = jsonToMarkdown(detailJson);
    const safeName = fileName.replace(/[\\/:*?"<>|]/g, "_");
    await fsP.writeFile(path.join(outputDir, `${safeName}.md`), mdContent, 'utf8');
}

// // Exemplo de chamada após obter o detalhe:
// const detailJson = /* resposta da API */;
// const outputDir = /* pasta onde salvar */;
// const fileName = /* nome do arquivo desejado */;
// await saveWorkItemDetailAsMd(detailJson, outputDir, fileName);

