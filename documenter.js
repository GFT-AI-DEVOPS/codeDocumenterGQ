const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');


async function documenter(LANGUAGE) {

  const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtV04yX3BjNy1paWk1QVRSbzdmVy1acER4SHF5LUc2SERYT0FtYW5GQUtFIn0.eyJleHAiOjE3NTAyOTU1MjAsImlhdCI6MTc1MDI1OTUyNSwiYXV0aF90aW1lIjoxNzUwMjU5NTIwLCJqdGkiOiI1OTA5ODkzYy01NzVmLTQ0MjQtYmE4Ni02OTk3ZmJjMDBhOGEiLCJpc3MiOiJodHRwOi8vYXV0aC5nZnRhaWltcGFjdC5sb2NhbC9yZWFsbXMvYWktaW1wYWN0IiwiYXVkIjpbImFpLWltcGFjdC1jbGllbnQiLCJhY2NvdW50Il0sInN1YiI6ImE4ZTA1N2Q0LWNjYzYtNDEzNi1iZTgzLTgyYWMyMjQ4ZTdlMiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFpLWltcGFjdC1jbGllbnQiLCJzaWQiOiIzN2YyYTA1NC1lNDNmLTQ3MDgtYjUwOC03Yjk0OTEyNGYxOTUiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsic3RvcnktY3JlYXRvciIsImNvZGUtZG9jdW1lbnRlciIsImNyZWF0ZS1yZWFsbSIsInNldHRpbmdzIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJjb2RlLXRlc3RlciIsImNvc3QtY29udHJvbCIsIm9mZmxpbmVfYWNjZXNzIiwidXNlci1jb250cm9sIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImNvZGUtZGlhbG9nZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhaS1pbXBhY3QtY2xpZW50Ijp7InJvbGVzIjpbInZpZXctcmVhbG0iLCJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicm9sZSI6WyJhZG1pbmlzdHJhdG9ycyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbmlzdHJhdG9yQGdmdC5jb20ifQ.hbEudtwG-bAWRlXZWy-ZtDdtl_ZmzDwjNnjPSzFFhSlz8JCW2VvFNWCEkRLdKssTCIyDFGNL6p_vpIfH_LA3uYfpDJytfcWTahDl8lqrfxm2TfNboLYNjubn3jMrBtrr3aWMVetQu4Z8GK5rvoml23vqwoyN1jMFAoF2WJkZWYdwqwGcnCoojvp2gQGRImrqD3xMZNwnMjVk4mzk-NRQg7otB20Wuplqxc8ZbqweGEIcjq39wfx1Vd-UT1IJl3-o_dJwkfp-6gYR0Y_ntSg_SyBtmV0GIGYu3ohjSFDy-a0NvgMjDKSwLE3ihWHMsQvXqFJ3Lf4nE5NGpOI_ut4Yzw";
  const LLM = "AWS_CLAUDE";
  // const promptId = "LegacyTransformer__Business_Rules";
  const promptId = "DocCreator__DocumentCode_V5";
  let jobNameFile = {}

  // Prepare the form data
  async function prepareAndSendToApi() {

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const pendingJobs = new Map();
    const failedFiles = [];


    const allFiles = JSON.parse(fsSync.readFileSync('allFiles.json', 'utf-8'))[LANGUAGE]


    for (const file of allFiles) {
      try {
        console.log(`\n🚀 Starting job for ${file}`);

        const form = new FormData();
        form.append('RunName', 'GenerateDocPR');
        form.append('jobName', 'DemoDocCreator');
        form.append('DocumentationFormat', 'markdown');
        form.append('DiagramFormat', 'Mermaid');
        form.append('SourceCodeLanguage', LANGUAGE);
        form.append('DocumentationAudience', 'Software Engineer');
        form.append('PromptId', promptId);
        form.append('TargetExtension', 'md');
        form.append('Llm', LLM);
        form.append('AdditionalInstructions', `Generate the documentation in pt-BR. If the code have vulnerabilities, describe all in a new # vulnerabilities section`);

        console.log("\nallFiles.length: ", (pendingJobs.size + 1) + '/' + allFiles.length + '\n')

        let count = 1;

        const repoRoot = process.cwd();
        const relativePath = path.relative(repoRoot, file);
        const docPath = path.join("Wynxx", promptId, relativePath + ".md");

        console.log(LANGUAGE, docPath)
        console.log("count: ", count)

        count++;

        const content = fsSync.readFileSync(file, 'utf8');

        if (!content.trim()) {
          console.log(`⚠️ File ${file} is empty, skipping.`);
          const logDir = path.join(__dirname, 'logs');
          await fs.mkdir(logDir, { recursive: true });
          const emptyLogFile = path.join(logDir, `empty_files_${LANGUAGE}_${promptId}.log`);
          await fs.appendFile(emptyLogFile, `${file}\n`);
          continue;
        }

        if (fsSync.existsSync(docPath)) {
          console.log(`Documentation already exists for ${file}, skipping.`);
          continue;
        } else {
          // if (file.includes('bancomercantil-main\\IPC')) {

          form.append('files', await fs.readFile(file), { filename: path.basename(file) });

          // } else { continue }
        };

        const response = await axios.post(
          'http://api.gftaiimpact.local/ai/document',
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        console.log('API Response:', response.data);


        const jobId = response.data;
        pendingJobs.set(jobId, file);
        console.log(`📩 Got jobId ${jobId} for ${file}`);
        jobNameFile[jobId] = file;
        await delay(500);
      } catch (err) {
        console.error(`❌ Failed to start job for ${file}:`, Object.keys(err.response), err.response.headers);
        failedFiles.push({ file, error: err.message, err: err });
      }
    }

    if (failedFiles.length > 0) {
      const logDir = path.join(__dirname, 'logs');
      await fs.mkdir(logDir, { recursive: true });
      const failedLogFile = path.join(logDir, `failed_requests_${LANGUAGE}_${promptId}.log`);
      if (!fsSync.existsSync(failedLogFile)) {
        await fs.writeFile(failedLogFile, '');
      }
      await fs.appendFile(failedLogFile, failedFiles.map(f => `${f.file}: ${f.error}`).join('\n') + '\n');
      console.log(`Logged failed files to ${failedLogFile}`);
    }

    return pendingJobs

  }

  async function monitorJobStatus(pendingJobs) {
    const results = [];
    let outputUris = [];

    const startDate = new Date().toISOString().replace(/[:.]/g, '-');
    const logDir = path.join(__dirname, 'logs');
    await fs.mkdir(logDir, { recursive: true });
    const logFile = path.join(logDir, `log_${promptId}.log`);
    if (!fsSync.existsSync(logFile)) {
      await fs.writeFile(logFile, '');
    }

    while (pendingJobs.size > 0) {
      for (const [jobId, key] of pendingJobs.entries()) {
        try {
          const res = await axios.get(
            `http://api.gftaiimpact.local/ai/jobs/${jobId}/status`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
          );

          const status = res.data.status;

          if (status === 'Completed' || status === 'CompletedWithErrors') {
            if (status === 'CompletedWithErrors') {
              console.warn(`⚠️ ${key} completed with errors:`, res.data.errors || 'Unknown errors');
              const errorLogFile = path.join(logDir, `CompletedWithErrors_${promptId}.log`);
              await fs.mkdir(logDir, { recursive: true });
              // Ensure the error log file exists, then append the error content
              if (!fsSync.existsSync(errorLogFile)) {
                await fs.writeFile(errorLogFile, '');
              }
              await fs.appendFile(
                errorLogFile,
                `Job completed with errors for key: ${key}\n${JSON.stringify(res.data.errors, null, 2)}\n`
              );

            }
            console.log(`✅ ${key} done`);
            results.push({ key, result: res.data.results });
            outputUris.push(...res.data.results.flatMap(r => r.output.map(o => o.uri)));
            pendingJobs.delete(jobId);
          } else if (status === 'Running') {
            console.log(`⏳ ${key} still processing`);
          } else {
            console.log(`❌ ${key} failed`);
            results.push({ key, error: 'Job failed' });
            pendingJobs.delete(jobId);
          }

          await fs.appendFile(logFile, JSON.stringify(res.data) + '\n');
        } catch (err) {
          console.error(`🚨 Error checking ${key}:`, err.response.headers);
        }
      }
      if (pendingJobs.size > 0) {
        await new Promise(r => setTimeout(r, 15000));
      }
    }

    await fs.appendFile(logFile, JSON.stringify(results) + '\n');
    console.log('🎯 All jobs done');
    console.log("outputUris: ", outputUris);

    return { outputUris };
  }

  async function saveGeneratedDocs(outputUris) {
    const allFilesData = JSON.parse(fsSync.readFileSync('allFiles.json', 'utf-8'));
    const languageFiles = allFilesData[LANGUAGE];

    for (const uri of outputUris) {
      const fileUrl = `http://api.gftaiimpact.local${uri}`;
      let fileResponse;
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        try {
          fileResponse = await axios.get(fileUrl, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          });
          break; // Success, exit loop
        } catch (err) {
          attempts++;
          if (attempts <= maxAttempts) {
            console.error(`❌ Failed to fetch ${fileUrl} after ${maxAttempts} attempts:`, err.message);
            const logDir = path.join(__dirname, 'logs');
            await fs.mkdir(logDir, { recursive: true });
            const failedFetchLog = path.join(logDir, `failed_fetch_${LANGUAGE}_${promptId}.log`);

            const status = err.response?.status || 'N/A';
            const data = err.response?.data || err.message;
            await fs.appendFile(
              failedFetchLog,
              `Failed to fetch: ${fileUrl} - Status: ${status} - Error: ${JSON.stringify(data)}\n`
            );
            continue; // Skip to next URI
          } else {
            console.warn(`⚠️ Error fetching ${fileUrl}, retrying in 5s (${attempts}/${maxAttempts})...`);
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
      if (!fileResponse) continue;

      const className = path.basename(uri);

      // Find the original file path using jobNameFile and jobId extracted from the URI
      const jobIdMatch = uri.match(/\/ai\/jobs\/([^/]+)/);
      let originalFilePath = null;
      if (jobIdMatch && jobNameFile[jobIdMatch[1]]) {
        originalFilePath = jobNameFile[jobIdMatch[1]];
      }

      if (!originalFilePath) {
        console.warn(`Original file for ${className} not found on key ${LANGUAGE}. Skipping.`);
        continue;
      }

      // Recreate the original file structure inside the promptId folder
      const repoRoot = process.cwd();
      const relativePath = path.relative(repoRoot, path.dirname(originalFilePath));
      const docFile = path.join("Wynxx", promptId, relativePath, className);

      await fs.mkdir(path.dirname(docFile), { recursive: true });

      await fs.writeFile(docFile, fileResponse.data);

      if (fsSync.existsSync(docFile)) {
        console.log(`✅ Confirmed: ${docFile} was saved and exists.`);
      } else {
        console.error(`❌ Error: ${docFile} was not found after saving!`);
        const errorLogDir = path.join(__dirname, 'logs');
        await fs.mkdir(errorLogDir, { recursive: true });
        const errorLogFile = path.join(errorLogDir, `save_errors_${LANGUAGE}_${promptId}.log`);
        await fs.appendFile(errorLogFile, `Failed to save: ${docFile}\n`);
      }
      console.log(`Saved documentation for ${className} to ${docFile}`);

      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const pendingJobs = await prepareAndSendToApi();
  console.log('Jobs IDs:', pendingJobs);
  const { outputUris } = await monitorJobStatus(pendingJobs);
  await saveGeneratedDocs(outputUris);
}
module.exports = documenter;

