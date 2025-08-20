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
                const ruleTitleMatch = ruleMatch[0].match(/\*\*(\d+\.\s*Rule:[^\n]*)/);
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

    if (!item.jobIds) item.jobIds = {};

    if (config.agileFullFileContent) {
        // Envia o arquivo inteiro uma única vez
        console.log(`Sending full file content for: ${item.fileName}`);
        const jobId = await sendSectionAndGetJobId(data, item.fileName, item);
        item.jobIds["FullFile"] = { jobId };
        writeJsonFile(jsonFilePath, files);

        const { status, result: jobResult } = await waitForJobCompletion(jobId, item.fileName, item.fileName);
        item.jobIds["FullFile"].status = status;
        if (status === "CompletedWithErrors") {
            item.jobIds["FullFile"].error = jobResult?.error || JSON.stringify(jobResult);
        }
        if (status === "Completed") {
            const uri = jobResult?.results?.[0]?.output?.[0]?.uri;
            if (uri) item.jobIds["FullFile"].uri = uri;
        }
        writeJsonFile(jsonFilePath, files);

        const safeName = fileBaseName.replace(/[\\/:*?"<>|]/g, "_");
        await fsP.writeFile(path.join(outputDir, `${safeName}_full.md`), data);

        // Agora processa o resultado normalmente, como faz para seções
        await processSectionDetails(item, "FullFile", item.jobIds["FullFile"]);

        item.downloaded = true;
        writeJsonFile(jsonFilePath, files);
        console.log(`Full file sent and processed for: ${item.fileName}`);
        return;
    }

    if (!item.jobIds) item.jobIds = {};

    for (const [section, value] of Object.entries(result)) {
        if (section === "Detailed Rules" && typeof value === "object") {
            if (!item.jobIds[section]) item.jobIds[section] = {};
            for (const [ruleName, ruleContent] of Object.entries(value)) {
                // Adicione apenas dentro de "Detailed Rules"
                const jobInfo = item.jobIds[section][ruleName];
                const shouldRetry = !jobInfo || isJobError(jobInfo.status) || !jobInfo.status;

                if (!shouldRetry) continue;

                const cleanContent = ruleContent.replace(/<!--[\s\S]*?-->/g, '');
                console.log(`Retrying section: ${section} > ${ruleName}`);

                const jobId = await sendSectionAndGetJobId(cleanContent, ruleName, item);
                item.jobIds[section][ruleName] = { jobId }; // <-- só aqui!
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
            // Seção principal, não adicione regras detalhadas aqui!
            if (section.startsWith("1. Rule:") || section.startsWith("2. Rule:") || section.startsWith("3. Rule:") || section.startsWith("4. Rule:") || section.startsWith("5. Rule:") || section.startsWith("6. Rule:") || section.startsWith("7. Rule:")) {
                continue; // Pula regras detalhadas fora de "Detailed Rules"
            }
            const jobInfo = item.jobIds[section];
            const shouldRetry = !jobInfo || isJobError(jobInfo.status) || !jobInfo.status;

            if (!shouldRetry) continue;

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

    // After all sections processed, para cada seção sem erro:
    for (const [section, jobInfo] of Object.entries(item.jobIds)) {
        if (section === "Detailed Rules" && typeof jobInfo === "object") {
            for (const [ruleName, ruleJobInfo] of Object.entries(jobInfo)) {
                // Passe o nome da regra como section
                await processSectionDetails(item, ruleName, ruleJobInfo);
            }
        } else if (
            section !== "Detailed Rules" &&
            !/^(\d+\.\s*Rule:)/.test(section) // <-- NÃO processe regras detalhadas fora de Detailed Rules
        ) {
            // Só crie pasta para seções que não são Detailed Rules nem regras detalhadas
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

async function processSectionDetails(item, sectionOrRuleName, jobInfo) {
    if (!jobInfo || jobInfo.status !== "Completed" || !jobInfo.jobId) return;

    // Decide where to update: top-level or inside "Detailed Rules"
    let jobIdsTarget;
    if (/^(\d+\.\s*Rule:)/.test(sectionOrRuleName)) {
        // Is a detailed rule, update inside "Detailed Rules"
        if (!item.jobIds["Detailed Rules"]) item.jobIds["Detailed Rules"] = {};
        if (!item.jobIds["Detailed Rules"][sectionOrRuleName]) item.jobIds["Detailed Rules"][sectionOrRuleName] = jobInfo;
        jobIdsTarget = item.jobIds["Detailed Rules"][sectionOrRuleName];
    } else {
        // Is a normal section, update top-level
        if (!item.jobIds[sectionOrRuleName]) item.jobIds[sectionOrRuleName] = jobInfo;
        jobIdsTarget = item.jobIds[sectionOrRuleName];
    }

    const processDefUrl = `${API_URL}/bff/agile/process-definition/${jobInfo.jobId}`;
    const processDefResp = await axios.get(processDefUrl, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    jobIdsTarget.processDefinition = processDefResp.data;
    writeJsonFile(jsonFilePath, files);

    for (const obj of processDefResp.data) {
        const detailUrl = `${API_URL}/bff/agile/work-item/${obj.id}/detail`;
        const detailResp = await axios.get(detailUrl, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });
        if (!jobIdsTarget.workItemDetails) jobIdsTarget.workItemDetails = {};
        jobIdsTarget.workItemDetails[obj.id] = detailResp.data;
        writeJsonFile(jsonFilePath, files);

        // Busca o Title no campo fields
        let title = "Untitled";
        if (detailResp.data.fields) {
            const titleField = detailResp.data.fields.find(f => f.alias === "Title" || f.name === "Title");
            if (titleField && titleField.value) {
                title = titleField.value;
            }
        }
        // Sanitiza o nome do arquivo
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_");

        const folderName = sectionOrRuleName.replace(/[\\/:*?"<>|]/g, "_");
        const folderPath = path.join(
            config.docsFolder,
            path.basename(item.fileName, path.extname(item.fileName)),
            folderName
        );
        await fsP.mkdir(folderPath, { recursive: true });

        // Usa apenas o Title como nome do arquivo
        const mdFileName = `${safeTitle}`;
        await saveWorkItemDetailAsMd(
            detailResp.data,
            folderPath,
            mdFileName
        );
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
    const safeName = fileName.replace(/[\\/:*?"<>|]/g, "_");

    // Salva o JSON normalmente
    const targetJsonPath = path.join(outputDir, `${safeName}.json`);
    await fsP.writeFile(targetJsonPath, JSON.stringify(detailJson, null, 2), 'utf8');
    console.log(`Work item detail saved: ${targetJsonPath}`);

    // Extrai os campos para o markdown
    let title = '';
    let description = '';
    let storyPoints = '';
    let acceptanceCriteria = '';

    if (detailJson.fields && Array.isArray(detailJson.fields)) {
        for (const field of detailJson.fields) {
            if ((field.alias === "Title" || field.name === "Title") && field.value) {
                title = field.value;
            }
            if ((field.alias === "Description" || field.name === "Description") && field.value) {
                description = field.value;
            }
            if ((field.alias === "Story Points" || field.name === "StoryPoints") && field.value) {
                storyPoints = field.value;
            }
            if ((field.alias === "Acceptance Criteria" || field.name === "AcceptanceCriteria") && field.value) {
                acceptanceCriteria = field.value;
            }
        }
    }

    // Monta o markdown
    const mdContent = [
        `# ${title}`,
        '',
        description,
        '',
        `**Story Points:** ${storyPoints}`,
        '',
        `**Acceptance Criteria:**`,
        acceptanceCriteria
    ].join('\n');

    // Salva o markdown
    const targetMdPath = path.join(outputDir, `${safeName}.md`);
    await fsP.writeFile(targetMdPath, mdContent, 'utf8');
    console.log(`Work item markdown saved: ${targetMdPath}`);
}


