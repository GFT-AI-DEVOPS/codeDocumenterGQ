# codeDocumenterGQ

## Visão Geral

Este projeto automatiza a geração de documentação técnica para arquivos fonte, utilizando um pipeline que inclui seleção de arquivos, envio para API de documentação, acompanhamento de jobs e download dos resultados.

## Estrutura dos Scripts

- [`generate-files-list.js`](codeDocumenter/generate-files-list.js): Gera o arquivo `codeDocumenterFiles.json` com a lista de arquivos a serem documentados, estimando tokens e validando limites.
- [`send-files.js`](codeDocumenter/send-files.js): Envia os arquivos listados para a API de documentação, gerenciando rate limit e salvando o progresso.
- [`download-files.js`](codeDocumenter/download-files.js): Faz o download dos arquivos de documentação gerados após a conclusão dos jobs.
- [`sequential.js`](codeDocumenter/sequential.js): Executa todo o fluxo de envio, acompanhamento e download de forma sequencial e concorrente, salvando o progresso e resultados.

## Configuração

O arquivo [`config.json`](codeDocumenter/config.json) define:
- Pasta de origem dos arquivos (`folderToInclude`)
- Extensões aceitas (`extensionsIncluded`)
- Limite de tokens por arquivo (`maxTokens`)
- Parâmetros de execução e documentação (idioma, formato, instruções adicionais)
- Mapeamento de extensões para linguagens
- Parâmetros de concorrência e limites

Exemplo de configuração relevante:
```json
{
  "folderToInclude": "C:/Programas_GO_Tratados",
  "docsFolder": "C:/.../generatedDocs/",
  "maxTokens": 200000,
  "sequentialConcurrency": 2,
  "promptId": "LegacyTransformer__Business_Rules"
}
```

## Como Usar

1. **Gerar a lista de arquivos:**
   ```sh
   node codeDocumenter/generate-files-list.js
   ```
2. **Enviar arquivos para documentação:**
   ```sh
   node codeDocumenter/send-files.js
   ```
3. **Baixar arquivos documentados:**
   ```sh
   node codeDocumenter/download-files.js
   ```
   Ou execute todo o fluxo sequencialmente:
   ```sh
   node codeDocumenter/sequential.js
   ```

## Observações

- Configure as variáveis de ambiente `ACCESS_TOKEN` e `API_URL` em um arquivo `.env`.
- O progresso e os resultados são salvos em `codeDocumenterFiles.json` e na pasta de destino configurada.
- O sistema respeita limites de tokens e concorrência definidos no `config.json`.

## Estrutura de Saída

A documentação gerada mantém a estrutura de diretórios da fonte:

```
generatedDocs/
└── NOME_DO_PROMPT/
    ├── services/
    │   └── UserService.md
    └── components/
        └── Login.md
```
> O diretório `NOME_DO_PROMPT` será substituído pelo valor definido em `promptId` no seu `config.json` (por exemplo, `LegacyTransformer__Business_Rules`). Não será criada uma pasta `src` ou `lib` — a estrutura interna preserva apenas os subdiretórios dos arquivos de origem.

## Solução de Problemas

### Problemas Comuns

**"Config has empty key(s)":**
- Verifique se todos os campos obrigatórios no `config.json` estão preenchidos
- Remova os comentários JSON (`//`) do arquivo de configuração
- Verifique se a sintaxe JSON é válida

**"Could not read or parse config.json":**
- Verifique a validade da sintaxe JSON
- Remova todos os comentários do JSON
- Verifique o caminho e as permissões do arquivo

**Erros de autenticação da API:**
```
Error sending file: 401 Unauthorized
```
- Verifique o `ACCESS_TOKEN` no arquivo `.env`
- Confira se o token não expirou
- Assegure-se de que você tenha acesso ao `api.gftaiimpact.local`

**Erros de conexão:**
```
Error sending file: connect ECONNREFUSED
```
- Verifique o acesso à VPN/rede para a API GFT AI Impact
- Confira se os endpoints da API estão acessíveis

**"codeDocumenterFiles.json already exists":**
- Exclua o arquivo para regenerar a lista de arquivos
- Ou continue com a lista de arquivos existente se estiver retomando

### Redefinir e Reiniciar

Para começar do zero:
```bash
# Excluir arquivos gerados
rm codeDocumenter/codeDocumenterFiles.json
rm -rf generatedDocs/

# Executar o fluxo novamente
node codeDocumenter/generate-files-list.js
```

### Monitorando o Progresso

- **Saída do console**: Cada script fornece logs detalhados de progresso
- **Arquivo de status**: Verifique `codeDocumenterFiles.json` para o status detalhado de cada arquivo
- **Rastreamento de erros**: Erros da API são capturados e armazenados para depuração

## Idiomas & Frameworks Suportados

| Linguagem   | Extensões                        | Recursos Suportados           |
|-------------|----------------------------------|-------------------------------|
| JavaScript  | `.js`, `.mjs`, `.cjs`, `.jsx`    | ES6+, React, Node.js          |
| TypeScript  | `.ts`, `.tsx`                    | Types, Interfaces, Generics   |
| Java        | `.java`, `.class`                | OOP, Spring Framework         |
| Python      | `.py`, `.pyw`, `.pyi`            | Classes, Functions, Modules   |
| C/C++       | `.c`, `.cpp`, `.h`, `.hpp`       | Structs, Pointers, Templates  |
| C#          | `.cs`, `.csx`                    | .NET Framework, LINQ          |
| Go          | `.go`                            | Goroutines, Channels          |
| Rust        | `.rs`, `.rlib`                   | Ownership, Traits             |

## Endpoints da API

A ferramenta conecta-se aos seguintes endpoints da API GFT AI Impact:

- **Enviar Job**: `POST https://bvw.bvolks.ai-impact.gft-cloud.com/ai/test`
- **Verificar Status**: `GET https://bvw.bvolks.ai-impact.gft-cloud.com/ai/jobs/{jobId}/status`
- **Baixar Arquivo**: `GET https://bvw.bvolks.ai-impact.gft-cloud.com{uri}`

## Notas de Segurança

- **Nunca comite** arquivos `.env` com tokens
- **Tokens expiram** — atualize-os regularmente no Keycloak
- **Acesso à rede** necessário para a API GFT AI Impact
- **Código sensível** é enviado para o serviço AI — assegure conformidade

## Suporte

Para problemas com:
- **Erros de script**: Verifique a configuração e os caminhos dos arquivos
- **Acesso à API**: Contate a equipe GFT AI Impact
- **Qualidade da documentação**: Ajuste `additionalInstructions` na configuração

## Dicas para Sucesso

1. **Comece pequeno**: Teste com alguns arquivos primeiro
2. **Configuração limpa**: Remova todos os comentários JSON antes de executar
3. **Verifique os caminhos**: Assegure que todos os caminhos são relativos e acessíveis
4. **Monitore o progresso**: Observe a saída do console e verifique o arquivo de status JSON
5. **Tenha paciência**: A etapa de download verifica a conclusão periodicamente
6. **Instruções personalizadas**: Use `additionalInstructions` para necessidades específicas de documentação

## Pré-requisitos

- [Node.js 18+ (testado com v24.5.0)](https://nodejs.org/) instalado na máquina.
- Instale as dependências do projeto executando:
  ```sh
  npm install
  ```

## Novidades no Script `sequential-agile.js`

### Geração de User Stories em JSON e Markdown

- Para cada item processado, o script gera:
  - Um arquivo `.json` com todos os detalhes da user story retornados pela API.
  - Um arquivo `.md` contendo:
    - **Título**
    - **Descrição**
    - **Story Points**
    - **Acceptance Criteria**

### Envio do Conteúdo Completo

- Se a chave `"agileFullFileContent": true` estiver presente no `config.json`, o script envia o conteúdo completo do arquivo para a API, ao invés de seções separadas.
- O processamento dos resultados segue igual, gerando os arquivos `.json` e `.md` para cada user story retornada.

### Nomes dos Arquivos

- Os arquivos gerados usam o campo **Title** retornado pela API como nome, sem o id.

### Estrutura de Saída

```
generatedDocs/
└── NOME_DO_PROMPT/
    └── NomeDoArquivo/
        └── FullFile/
            ├── TituloDaUserStory.json
            └── TituloDaUserStory.md
```

### Exemplo de Markdown Gerado

```markdown
# Implementação da geração de registros para sistema Corporate

Descrição detalhada da user story...

**Story Points:** 8

**Acceptance Criteria:**
- Critério 1
- Critério 2
```

### Observações sobre `.gitignore`

- O script **não ignora** a pasta `generatedDocs/`; quem faz isso é o Git, conforme configurado no arquivo `.gitignore`.
- Os arquivos gerados continuarão sendo criados normalmente, mas não serão rastreados pelo Git se estiverem listados no `.gitignore`.

---

> As demais funcionalidades e scripts do repositório continuam funcionando normalmente.  
> Consulte as seções anteriores do README para detalhes sobre os outros scripts.