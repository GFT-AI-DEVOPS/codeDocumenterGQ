**1. Rule: Inicializacao do Sistema e Controle de Data de Processamento**
- **Function/Method Name:** R010INICIALIZA
- **Detailed Description of the Rule:** Esta regra inicializa o sistema, obtem a data atual, determina a data de processamento das transacoes suspensas e configura as contas contabeis para diferentes tipos de operacao
- **What it proposes to do:** Preparar o ambiente de processamento e definir parametros de controle
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. Abrir todos os arquivos de saida (AD1GO002, AB1GO002, AB2GO002, AB3GO002)
  2. Chamar funcao YY115A para obter data e hora atual do sistema
  3. Extrair dia, mes, ano, hora e minuto da data retornada
  4. Executar consulta SQL: SELECT MIN(PKDTDTPROC) FROM AXG1000.PAKF018VCONTROLE WHERE ATSFMOVPROC <> 'N'
  5. Se SQLCODE diferente de zero OU resultado menor que zero, exibir erro e cancelar processamento
  6. Converter data obtida para formato dia/mes/ano e armazenar nos titulos do relatorio
  7. Inicializar todas as variaveis de totalizacao com zero
  8. Para cada codigo SAP (3412, 3413, 4412):
     - Definir WS06CONVCOMPLEMENTO = codigo SAP
     - Chamar rotina R069ACESSACONTA para obter contas debito e credito
     - Armazenar contas nas variaveis correspondentes (WSCTDEBITO/WSCTCREDITO + codigo)
  9. Executar COMMIT para confirmar transacao