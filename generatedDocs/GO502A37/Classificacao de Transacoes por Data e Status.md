**3. Rule: Classificacao de Transacoes por Data e Status**
- **Function/Method Name:** Logica dentro de R020PROCESSA
- **Detailed Description of the Rule:** Esta regra classifica transacoes em diferentes categorias baseadas na data de processamento e status, aplicando calculos especificos para cada tipo
- **What it proposes to do:** Determinar o tipo de operacao e aplicar calculos de totalizacao apropriados
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. **Transacoes Pendentes (ATDTPROCSUSP <> PKDTDTPROC E WSATSFSTATUS = 1):**
     - Definir descricao = "PENDENTE"
     - Somar 1 ao contador WSQTDESALDOATU
     - Se FKNICODLANC entre 999 e 2000: somar ATNDVALORCR a WSVLRDEBATU
     - Senao: somar ATNDVALORCR a WSVLRCREDATU
     - Sair da rotina

  2. **Inclusoes do Dia (ATDTPROCSUSP = PKDTDTPROC E WSATSFSTATUS = 1):**
     - Se WSATNISUSPENSOANTNN <= 1:
       - Somar 1 a WSQTDEINCLU
       - Definir descricao = "INCLUIDO DIA E PENDENTE"
     - Senao:
       - Somar 1 a WSQTDETRANS
       - Definir descricao = "INCL.TRANSF. PENDENTE"
     - Chamar R030IMPRIMEDET para imprimir detalhes
     - Somar 1 a WSQTDESALDOATU
     - Aplicar mesma logica de debito/credito do item 1

  3. **Inclusoes com Regularizacao no Mesmo Dia:**
     - Se ATDTPROCSUSP = PKDTDTPROC E ATDTREGULAR = PKDTDTPROC E WSATSFSTATUS <> 1:
       - Chamar R037VERIFABSORCAO para verificar absorcao
       - Se existe absorcao: definir descricao = "ABSORCAO"
       - Senao: usar descricao do lancamento
       - Definir descricao1 = "INCLUIDO DIA"
       - Imprimir detalhes duas vezes (inclusao e regularizacao)
       - Aplicar calculos baseados no status final

  4. **Regularizacoes de Dias Anteriores:**
     - Se ATDTREGULAR = PKDTDTPROC E WSATSFSTATUS <> 1:
       - Chamar R050VESTATUS para definir descricao do status
       - Imprimir detalhes
       - Aplicar calculos baseados no status