**7. Rule: Geracao de Registros Corporate**
- **Function/Method Name:** R035GRAVARCORPORATE
- **Detailed Description of the Rule:** Esta regra gera registros para sistema Corporate com dados detalhados de cada transacao
- **What it proposes to do:** Criar registro padronizado para integracao com sistema Corporate
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. **Inicializacao 
Data Structure

Esta secao descreve as estruturas de dados utilizadas pelo programa GO502A37, incluindo registros de entrada, saida e variaveis de trabalho essenciais para o processamento de transacoes suspensas.

| Field ID | Field Name | Data Type | Field Size | Description | Mandatory | Default Value | Additional Notes | Relevant for Modernization | Information Type |
|----------|------------|-----------|------------|-------------|-----------|---------------|------------------|---------------------------|------------------|
| PAKF023-01 | PKNISUSPENSO | Numeric | 9 | Numero sequencial unico da transacao suspensa | Sim | - | Chave primaria da tabela | CRITICA | Primary Key |
| PAKF023-02 | FKNICONTRATO | Numeric | 9 | Numero do contrato associado a transacao | Sim | - | Chave estrangeira para PAKF008VCONTRATO | ALTA | Foreign Key |
| PAKF023-03 | FKNIDOCUMENTO | Numeric | 9 | Numero do documento da transacao | Nao | 0 | Pode ser nulo | MEDIA | Business Data |
| PAKF023-04 | ATNDVALORCR | Decimal | 15,2 | Valor da transacao em reais | Sim | - | Valor monetario com 2 decimais | CRITICA | Financial Data |
| PAKF023-05 | ATDTPAGTO | Date | 10 | Data de pagamento da transacao | Nao | SPACES | Formato AAAA-MM-DD | ALTA | Date Field |
| PAKF023-06 | ATDTDTCRED | Date | 10 | Data de credito da transacao | Nao | SPACES | Formato AAAA-MM-DD | ALTA | Date Field |
| PAKF023-07 | ATDTPROCSUSP | Date | 10 | Data de processamento da suspensao | Sim | - | Data de inclusao do registro | CRITICA | Date Field |
| PAKF023-08 | FKNDBANCO | Numeric | 3 | Codigo do banco | Nao | 0 | Codigo numerico do banco | MEDIA | Reference Data |
| PAKF023-09 | FKNICODLANC | Numeric | 4 | Codigo do tipo de lancamento | Sim | - | Define se e debito ou credito | CRITICA | Business Rule |
| PAKF023-10 | ATNIMOTIVO | Numeric | 4 | Codigo do motivo da suspensao | Sim | - | Referencia para PAKG002VTIPO | ALTA | Reference Data |
| PAKF023-11 | ATSFSTATUS | Character | 1 | Status atual da transacao | Sim | - | 1=Pendente, 2=Baixa, 3=Regularizado, 4=Residuo, 5=RegContabil | CRITICA | Status Field |
| PAKF023-12 | ATSFSITUACAO | Character | 1 | Situacao da transacao | Sim | - | Controla se transacao esta ativa | ALTA | Status Field |
| PAKF023-13 | ATNICODSAP | Numeric | 4 | Codigo SAP da transacao | Nao | 0 | Usado para integracao SAP | ALTA | Integration Data |
| PAKF023-14 | ATSFUSERID | Character | 8 | Usuario que processou a transacao | Nao | SPACES | Auditoria de usuario | MEDIA | Audit Data |
| PAKF023-15 | ATSFPROGRAMA | Character | 8 | Programa que gerou a transacao | Nao | SPACES | Auditoria de sistema | BAIXA | Audit Data |
| PAKF023-16 | ATNICODSAPANT | Numeric | 4 | Codigo SAP anterior | Nao | 0 | Historico de alteracoes SAP | MEDIA | Historical Data |
| PAKF023-17 | ATSFNOSSONUM | Character | 12 | Nosso numero do banco | Nao | SPACES | Identificacao bancaria | MEDIA | Banking Data |
| PAKF023-18 | ATNDBANCOARREC | Numeric | 3 | Banco arrecadador | Nao | 0 | Banco que processou pagamento | MEDIA | Banking Data |
| PAKF023-19 | ATNDAGENCIA | Numeric | 5 | Agencia arrecadadora | Nao | 0 | Agencia que processou pagamento | MEDIA | Banking Data |
| PAKF023-20 | ATSFFORMAPAGTO | Character | 8 | Forma de pagamento | Nao | SPACES | Tipo de pagamento utilizado | MEDIA | Business Data |
| PAKF023-21 | ATNISUSPENSOANT | Numeric | 9 | Numero da suspensao anterior | Nao | 0 | Controle de transferencias | ALTA | Control Data |
| PAKF023-22 | ATDTREGULAR | Date | 10 | Data de regularizacao | Nao | SPACES | Data de resolucao da suspensao | ALTA | Date Field |
| PAKF008-01 | FKNDCPFCGC | Numeric | 15 | CPF ou CNPJ do cliente | Sim | - | Documento do cliente | ALTA | Personal Data |
| PAKF008-02 | FKSFTIPOCLI | Character | 1 | Tipo de cliente | Sim | - | F=Fisica, J=Juridica | ALTA | Classification |
| PAKF008-03 | ATNISTOPER | Numeric | 4 | Status da operacao do contrato | Nao | 0 | Status operacional | MEDIA | Status Field |
| PAKF008-04 | ATDTSTOPER | Date | 10 | Data do status da operacao | Nao | SPACES | Data da ultima alteracao status | MEDIA | Date Field |
| PAKF008-05 | ATSFTIPOFIN | Character | 3 | Tipo de financiamento | Nao | SPACES | Categoria do financiamento | MEDIA | Classification |
| PAKF008-06 | ATSFTPOPER | Character | 3 | Tipo de operacao | Nao | SPACES | Categoria da operacao | MEDIA | Classification |
| PAKF008-07 | ATSVNOMECLI | Character | 60 | Nome do cliente | Nao | SPACES | Nome completo ou razao social | ALTA | Personal Data |
| PAKF005-01 | FKNDFILIAL | Numeric | 3 | Codigo da filial | Sim | - | Identificacao da filial | ALTA | Organizational |
| PAKF018-01 | PKDTDTPROC | Date | 10 | Data de processamento atual | Sim | - | Data de referencia do processamento | CRITICA | Control Data |
| WS-TOT-01 | WSQTDESALDOANT | Numeric | 9 | Quantidade saldo anterior | Nao | 0 | Contador de transacoes saldo anterior | ALTA | Calculated Field |
| WS-TOT-02 | WSVLRDEBANT | Decimal | 15,2 | Valor debito anterior | Nao | 0 | Soma valores debito saldo anterior | ALTA | Calculated Field |
| WS-TOT-03 | WSVLRCREDANT | Decimal | 15,2 | Valor credito anterior | Nao | 0 | Soma valores credito saldo anterior | ALTA | Calculated Field |
| WS-TOT-04 | WSQTDESALDOATU | Numeric | 9 | Quantidade saldo atual | Nao | 0 | Contador de transacoes saldo atual | ALTA | Calculated Field |
| WS-TOT-05 | WSVLRDEBATU | Decimal | 15,2 | Valor debito atual | Nao | 0 | Soma valores debito saldo atual | ALTA | Calculated Field |
| WS-TOT-06 | WSVLRCREDATU | Decimal | 15,2 | Valor credito atual | Nao | 0 | Soma valores credito saldo atual | ALTA | Calculated Field |
| WS-TOT-07 | WSQTDEINCLU | Numeric | 9 | Quantidade inclusoes | Nao | 0 | Contador de inclusoes do dia | ALTA | Calculated Field |
| WS-TOT-08 | WSVLRDEBINCLU | Decimal | 15,2 | Valor debito inclusoes | Nao | 0 | Soma valores debito inclusoes | ALTA | Calculated Field |
| WS-TOT-09 | WSVLRCREDINCLU | Decimal | 15,2 | Valor credito inclusoes | Nao | 0 | Soma valores credito inclusoes | ALTA | Calculated Field |
| WS-TOT-10 | WSQTDETRANS | Numeric | 9 | Quantidade transferencias | Nao | 0 | Contador de transferencias | ALTA | Calculated Field |
| WS-TOT-11 | WSVLRDEBTRANS | Decimal | 15,2 | Valor debito transferencias | Nao | 0 | Soma valores debito transferencias | ALTA | Calculated Field |
| WS-TOT-12 | WSVLRCREDTRANS | Decimal | 15,2 | Valor credito transferencias | Nao | 0 | Soma valores credito transferencias | ALTA | Calculated Field |
| WS-TOT-13 | WSQTDEBAIXA | Numeric | 9 | Quantidade baixas | Nao | 0 | Contador de baixas do dia | ALTA | Calculated Field |
| WS-TOT-14 | WSVLRDEBBAIXA | Decimal | 15,2 | Valor debito baixas | Nao | 0 | Soma valores debito baixas | ALTA | Calculated Field |
| WS-TOT-15 | WSVLRCREDBAIXA | Decimal | 15,2 | Valor credito baixas | Nao | 0 | Soma valores credito baixas | ALTA | Calculated Field |
| WS-TOT-16 | WSQTDEEXCL | Numeric | 9 | Quantidade exclusoes | Nao | 0 | Contador de exclusoes regularizacoes | ALTA | Calculated Field |
| WS-TOT-17 | WSVLRDEBEXCL | Decimal | 15,2 | Valor debito exclusoes | Nao | 0 | Soma valores debito exclusoes | ALTA | Calculated Field |
| WS-TOT-18 | WSVLRCREDEXCL | Decimal | 15,2 | Valor credito exclusoes | Nao | 0 | Soma valores credito exclusoes | ALTA | Calculated Field |
| WS-TOT-19 | WSQTDEREGCTB | Numeric | 9 | Quantidade registros contabeis | Nao | 0 | Contador registros contabeis | ALTA | Calculated Field |
| WS-TOT-20 | WSVLRDEBREGCTB | Decimal | 15,2 | Valor debito registros contabeis | Nao | 0 | Soma valores debito reg contabeis | ALTA | Calculated Field |
| WS-TOT-21 | WSVLRCREDREGCTB | Decimal | 15,2 | Valor credito registros contabeis | Nao | 0 | Soma valores credito reg contabeis | ALTA | Calculated Field |
| WS-TOT-22 | WSSALDOCONTA | Decimal | 15,2 | Saldo da conta | Nao | 0 | Diferenca entre creditos e debitos | CRITICA | Calculated Field |
| SAP-01 | WS012CORPORA | Character | 3 | Codigo corporativo SAP | Sim | E04 | Identificacao da empresa no SAP | ALTA | SAP Integration |
| SAP-02 | WS012DATA | Character | 6 | Data do lancamento SAP | Sim | - | Formato DDMMAA | ALTA | SAP Integration |
| SAP-03 | WS012CONTA | Character | 10 | Conta contabil SAP | Sim | - | Numero da conta contabil | CRITICA | SAP Integration |
| SAP-04 | WS012DC | Character | 1 | Debito ou Credito | Sim | - | D=Debito, C=Credito | CRITICA | SAP Integration |
| SAP-05 | WS012VALOR | Decimal | 13,2 | Valor do lancamento SAP | Sim | - | Valor monetario | CRITICA | SAP Integration |
| SAP-06 | WS012HISTORICO | Character | 50 | Historico do lancamento | Nao | SPACES | Descricao da operacao | MEDIA | SAP Integration |
Items Relevant for Modernization Esta secao identifica os componentes do programa GO502A37 que possuem maior relevancia para o processo de modernizacao, considerando impacto no negocio, complexidade tecnica e dependencias criticas.

**Componentes Criticos para Modernizacao**

**Logica de Negocio Principal**
- R020PROCESSA - Processamento central de transacoes com regras complexas de classificacao por status e data
- Algoritmos de calculo de saldos e totalizadores por filial com formulas matematicas especificas
- Regras de determinacao debito/credito baseadas em codigo de lancamento (999-2000)
- Logica de absorcao de transacoes com verificacao na tabela PAKF074VABSORCAO

**Integracao com Sistemas Externos**
- Geracao de lancamentos SAP com estrutura especifica de debito/credito
- Criacao de registros Corporate com mapeamento de contas contabeis
- Consultas SQL complexas com multiplas tabelas e joins
- Controle de transacoes DB2 com tratamento de erros SQLCODE

**Estruturas de Dados Complexas**
- Cursor REGISTRO com 25 campos de diferentes tabelas
- Estruturas de totalizacao WSTOTAIS e WSTOTAISGER com 22 campos cada
- Mapeamento de contas contabeis por codigo SAP (3412, 3413, 4412)
- Formatacao de registros de saida com layouts fixos

**Processamento de Arquivos**
- Geracao simultanea de 4 arquivos de saida com formatos distintos
- Controle de paginacao e quebras de pagina automaticas
- Formatacao de relatorios com cabecalhos e rodapes dinamicos
- Gravacao de registros SAP e Corporate com estruturas especificas

**Validacoes e Controles**
- Tratamento de campos nulos com conversao para zeros/espacos
- Validacao de datas e valores monetarios
- Controle de mudanca de filial com impressao de subtotais
- Verificacao de existencia de registros em tabelas relacionadas

**Calculos Financeiros**
- Formula de saldo anterior: atual - inclusoes - transferencias - baixas - exclusoes - reg.contabeis
- Calculo de saldo da conta: creditos atuais - debitos atuais
- Acumulacao de totais gerais por tipo de operacao
- Separacao de valores por status de transacao

**Dependencias de Sistema**
- Programas utilitarios YY035A e YY115A para controle de arquivos e data
- Copybooks de estruturas de dados (GN111V00, GO023V00, etc.)
- Tabelas de parametrizacao (PAKG111VLANCTOCON, PAKG002VTIPO)
- Controle de processamento via tabela PAKF018VCONTROLE

**Componentes de Menor Prioridade**
- Formatacao de legendas e descricoes de motivos
- Impressao de cabecalhos e titulos de relatorio
- Contadores de linhas e paginas
- Mensagens de erro e displays informativos

**Recomendacoes para Modernizacao**
1. Priorizar migracao da logica de negocio central (R020PROCESSA)
2. Criar APIs para substituir integracao SAP e Corporate
3. Implementar novo modelo de dados para substituir estruturas COBOL
4. Desenvolver servicos para calculos financeiros e totalizadores
5. Modernizar controle de arquivos com tecnologias de streaming
6. Substituir cursores SQL por paginacao moderna
7. Implementar cache para consultas de parametrizacao
8. Criar testes automatizados para validar calculos complexos
Items Irrelevant for Modernization Esta secao identifica os componentes do programa GO502A37 que possuem baixa relevancia para o processo de modernizacao e podem ser ignorados ou substituidos por funcionalidades modernas padrao.

Componentes de Baixa Prioridade

Formatacao de Relatorios Impressos
- Estruturas de cabecalho WCAB01, WCAB02, WCAB03 com formatacao fixa de 133 caracteres
- Controle de paginacao manual com contadores CTLIN, CTPAG, CTLINHAS
- Formatacao de detalhes WDET01, WDET02 com espacamento fixo
- Impressao de linhas em branco e separadores visuais
- Controle de quebra de pagina AFTER ADVANCING PAGE

Legendas e Descricoes Auxiliares
- Rotina R070IMPRIMELEGENDACAB para impressao de cabecalhos de legenda
- Rotina R080IMPRIMELEGENDADET para impressao de detalhes de legenda
- Estruturas WMOT01, WMOT02 para titulos de legendas
- Formatacao de codigos e descricoes em duas colunas WDETMOT
- Consulta a tabela PAKG002VTIPO apenas para exibicao

Controles de Apresentacao
- Variaveis de formatacao de data WSDATAAUX com separadores
- Estruturas de titulo WSTITULO1, WSTITULO2 com textos fixos
- Formatacao de valores monetarios com mascaras ZZZZZZZZZZZZ9,99
- Controle de espacamento e alinhamento de campos
- Definicao de caracteres de preenchimento FILLER

Mensagens e Displays
- Mensagens de erro padrao ERRO NA TABELA, ERRO NA LEITURA
- Displays informativos de inicio e fim de processamento
- Contadores de registros lidos, linhas impressas, paginas
- Mensagem de arquivo vazio WSEMMOVTO
- Displays de debug com valores de campos

Utilitarios de Sistema Obsoletos
- Programa YY035A para controle de arquivos pode ser substituido por APIs modernas
- Programa YY115A para data/hora pode ser substituido por funcoes nativas
- Estrutura GNDATUM complexa para manipulacao de datas
- Conversores de data entre formatos diferentes
- Controle manual de abertura/fechamento de arquivos

Validacoes Basicas
- Rotina R025VERIFICACAMPOS para tratar campos nulos simples
- Conversao de valores negativos para zero
- Validacao basica de SQLCODE diferente de zero
- Tratamento de espacos em campos de data
- Inicializacao de variaveis com SPACES e ZEROS

Estruturas de Trabalho Temporarias
- Variaveis auxiliares WS0, WS2, WS4, WS18, WS43 com valores constantes
- Campos de controle CHAVEFIM, WSSITUACAOANTES, WSFILIALANT
- Contadores temporarios para loops e iteracoes
- Variaveis de flag como WSEXISTE074V
- Campos de trabalho para formatacao WSDESCROBS1, WSDESCROBS2

Funcionalidades Substituiveis por Tecnologias Modernas
- Controle manual de transacoes SQL com COMMIT
- Abertura explicita de cursores com DECLARE e OPEN
- Fechamento manual de arquivos e cursores
- Tratamento de fim de arquivo com SQLCODE = 100
- Controle de retorno com RETURNCODE e GOBACK

Recomendacoes para Modernizacao
1. Substituir formatacao de relatorios por geradores modernos PDF/HTML
2. Implementar logging estruturado no lugar de displays
3. Usar bibliotecas modernas para manipulacao de data/hora
4. Aplicar validacao declarativa em modelos de dados
5. Implementar paginacao automatica em APIs REST
6. Usar frameworks de template para formatacao de saidas
7. Substituir controles manuais por gerenciamento automatico de recursos
8. Implementar tratamento de excecoes moderno no lugar de codigos de retorno