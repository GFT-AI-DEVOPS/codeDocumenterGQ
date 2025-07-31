# Code Documenter GQ - Automated Documentation Generator

This project automatically generates comprehensive documentation for your codebase using AI-powered analysis. The workflow consists of three sequential scripts that scan your code, send it for AI processing, and download the generated documentation.

## 📋 Prerequisites

### Required Software
- **Node.js** (version 18 or higher with ES modules support)
- **Access to GFT AI Impact API** (internal network required)

### Required Environment Variables
Create a `.env` file in the root directory:
```env
ACCESS_TOKEN=your_keycloak_access_token_here
```

## 🚀 Quick Start

### 1. Configure the Project

Edit `codeDocumenter/config.json` with your project settings:

```json
{
    "foldersToInclude": [
        "./src",
        "./lib"
    ],
    "foldersToExclude": [
        "node_modules",
        "dist",
        "build"
    ],
    "extensionsIncluded": [
        ".js",
        ".java",
        ".ts",
        ".py"
    ],
    "docsFolder": "./generatedDocs/",
    "RunName": "GenerateDocPR",
    "jobName": "DemoDocCreator",
    "DocumentationFormat": "markdown",
    "DiagramFormat": "Mermaid",
    "DocumentationAudience": "Software Engineer",
    "TargetExtension": "md",
    "promptId": "DocCreator__DocumentCode_Chain_v2",
    "additionalInstructions": "Generate comprehensive documentation with code examples",
    "llm": "AWS_CLAUDE",
    "extensionToLanguage": {
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".java": "Java",
        ".py": "Python"
    }
}
```

### 2. Install Dependencies

```bash
npm install axios form-data dotenv
```

### 3. Run the Scripts

Execute the scripts in order:

```bash
# Step 1: Generate files list
node codeDocumenter/generate-files-list.js

# Step 2: Send files to AI for processing
node codeDocumenter/send-files.js

# Step 3: Download generated documentation
node codeDocumenter/download-files.js
```

## 📖 Configuration Guide

### Required Configuration Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `foldersToInclude` | Array | Directories to scan for source files | `["./src", "./lib"]` |
| `foldersToExclude` | Array | Directories to ignore (can be empty) | `["node_modules", "test"]` |
| `extensionsIncluded` | Array | File extensions to process | `[".js", ".java", ".ts"]` |
| `docsFolder` | String | Output directory for generated docs | `"./generatedDocs/"` |
| `DocumentationFormat` | String | Output format for documentation | `"markdown"` |
| `DiagramFormat` | String | Format for generated diagrams | `"Mermaid"` |
| `DocumentationAudience` | String | Target audience for docs | `"Software Engineer"` |
| `promptId` | String | AI prompt template ID | `"DocCreator__DocumentCode_Chain_v2"` |
| `additionalInstructions` | String | Custom instructions for AI | `"Include vulnerability analysis"` |
| `llm` | String | AI model to use | `"AWS_CLAUDE"` |

### Path Configuration

**✅ Use relative paths** for cross-platform compatibility:
```json
{
    "foldersToInclude": ["./src", "./components"],
    "docsFolder": "./generatedDocs/"
}
```

**❌ Avoid absolute paths** (won't work in CI/CD):
```json
{
    "foldersToInclude": ["C:/Users/user/project/src"],
    "docsFolder": "C:/Users/user/project/docs/"
}
```

### ⚠️ Important Notes

- **Remove all JSON comments** (`//`) from your config.json before running
- Ensure `docsFolder` ends with a forward slash `/`
- All fields except `foldersToExclude` must have values

## 🔄 Script Workflow

### 1. `generate-files-list.js`
- **Purpose**: Scans configured directories for source files
- **Input**: Configuration from `config.json`
- **Output**: Creates `codeDocumenterFiles.json` with file metadata
- **Behavior**: Exits if `codeDocumenterFiles.json` already exists

**Sample output:**
```json
[
  {
    "fileName": "UserService.js",
    "originalPath": "src/services/UserService.js",
    "jobId": null,
    "error": null,
    "uri": null,
    "downloaded": false
  }
]
```

### 2. `send-files.js`
- **Purpose**: Sends source files to AI API for documentation generation
- **Input**: Files from `codeDocumenterFiles.json`
- **Process**: 
  - Reads each source file
  - Maps file extensions to programming languages
  - Sends to AI API with configuration parameters
  - Updates `codeDocumenterFiles.json` with job IDs
- **Rate Limiting**: 250ms delay between requests

### 3. `download-files.js`
- **Purpose**: Downloads generated documentation when AI processing completes
- **Process**:
  - Polls job status every 500ms
  - Downloads completed documentation files
  - Saves to configured `docsFolder`
  - Maintains original directory structure
- **Output**: Generated documentation files with proper structure

## 📁 Output Structure

Generated documentation maintains your source directory structure:

```
generatedDocs/
├── src/
│   ├── services/
│   │   └── UserService.md
│   └── components/
│       └── Login.md
└── lib/
    └── utils/
        └── helpers.md
```

## 🔧 Troubleshooting

### Common Issues

**"Config has empty key(s)":**
- Ensure all required fields in `config.json` are filled
- Remove JSON comments (`//`) from the config file
- Verify JSON syntax is valid

**"Could not read or parse config.json":**
- Check JSON syntax validity
- Remove all comments from JSON
- Verify file path and permissions

**API authentication errors:**
```
Error sending file: 401 Unauthorized
```
- Verify `ACCESS_TOKEN` in the `.env` file
- Check if token has expired
- Ensure you have access to `api.gftaiimpact.local`

**Connection errors:**
```
Error sending file: connect ECONNREFUSED
```
- Verify VPN/network access to GFT AI Impact API
- Check if API endpoints are accessible

**"codeDocumenterFiles.json already exists":**
- Delete the file to regenerate the file list
- Or continue with existing file list if resuming

### Reset and Restart

To start fresh:
```bash
# Delete generated files
rm codeDocumenter/codeDocumenterFiles.json
rm -rf generatedDocs/

# Run workflow again
node codeDocumenter/generate-files-list.js
```

### Monitoring Progress

- **Console Output**: Each script provides detailed progress logging
- **Status File**: Check `codeDocumenterFiles.json` for detailed status of each file
- **Error Tracking**: API errors are captured and stored for debugging

## 📋 Supported Languages & Frameworks

| Language | Extensions | Supported Features |
|----------|------------|-------------------|
| JavaScript | `.js`, `.mjs`, `.cjs`, `.jsx` | ES6+, React, Node.js |
| TypeScript | `.ts`, `.tsx` | Types, Interfaces, Generics |
| Java | `.java`, `.class` | OOP, Spring Framework |
| Python | `.py`, `.pyw`, `.pyi` | Classes, Functions, Modules |
| C/C++ | `.c`, `.cpp`, `.h`, `.hpp` | Structs, Pointers, Templates |
| C# | `.cs`, `.csx` | .NET Framework, LINQ |
| Go | `.go` | Goroutines, Channels |
| Rust | `.rs`, `.rlib` | Ownership, Traits |

## 📊 API Endpoints

The tool connects to these GFT AI Impact API endpoints:

- **Submit Job**: `POST http://api.gftaiimpact.local/ai/test`
- **Check Status**: `GET http://api.gftaiimpact.local/ai/jobs/{jobId}/status`
- **Download File**: `GET http://api.gftaiimpact.local{uri}`

## 🛡️ Security Notes

- **Never commit** `.env` files with tokens
- **Tokens expire** - refresh Keycloak tokens regularly
- **Network access** required to GFT AI Impact API
- **Sensitive code** is sent to AI service - ensure compliance

## 📞 Support

For issues with:
- **Script errors**: Check configuration and file paths
- **API access**: Contact GFT AI Impact team
- **Documentation quality**: Adjust `additionalInstructions` in config

## 💡 Tips for Success

1. **Start Small**: Test with a few files first
2. **Clean Config**: Remove all JSON comments before running
3. **Check Paths**: Verify all paths are relative and accessible
4. **Monitor Progress**: Watch console output and check the JSON status file
5. **Be Patient**: The download step polls for completion every 500ms
6. **Customize Instructions**: Use `additionalInstructions` for specific documentation needs