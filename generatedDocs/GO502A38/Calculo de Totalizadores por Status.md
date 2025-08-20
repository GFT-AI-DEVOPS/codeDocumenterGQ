**4. Rule: Calculo de Totalizadores por Status**
- **Function/Method Name:** Logica de totalizacao em R020PROCESSA
- **Detailed Description of the Rule:** Esta regra aplica calculos matematicos especificos baseados no status da transacao e codigo de lancamento
- **What it proposes to do:** Calcular valores de debito, credito e quantidades para diferentes tipos de operacao
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. **Determinacao Debito/Credito:**
     - Se FKNICODLANC >= 999 E FKNICODLANC <= 2000: transacao = DEBITO
     - Senao: transacao = CREDITO

  2. **Calculos por Status - DEBITO:**
     - Status 2 (Baixa): WSVLRDEBBAIXA += ATNDVALORCR; WSQTDEBAIXA += 1
     - Status 5 (Reg.Contabil): WSVLRDEBREGCTB += ATNDVALORCR; WSQTDEREGCTB += 1; WSQTDE1REGCTB += 1
     - Outros status: WSVLRDEBEXCL += ATNDVALORCR; WSQTDEEXCL += 1

  3. **Calculos por Status - CREDITO:**
     - Status 2 (Baixa): WSVLRCREDBAIXA += ATNDVALORCR; WSQTDEBAIXA += 1
     - Status 5 (Reg.Contabil): WSVLRCREDREGCTB += ATNDVALORCR; WSQTDEREGCTB += 1; WSQTDE1REGCTB += 1
     - Outros status: WSVLRCREDEXCL += ATNDVALORCR; WSQTDEEXCL += 1

  4. **Calculos para Inclusoes:**
     - Se WSATNISUSPENSOANTNN <= 1:
       - DEBITO: WSVLRDEBINCLU += ATNDVALORCR
       - CREDITO: WSVLRCREDINCLU += ATNDVALORCR
     - Senao:
       - DEBITO: WSVLRDEBTRANS += ATNDVALORCR
       - CREDITO: WSVLRCREDTRANS += ATNDVALORCR