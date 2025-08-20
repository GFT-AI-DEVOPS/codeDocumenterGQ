**6. Rule: Geracao de Lancamentos SAP**
- **Function/Method Name:** R065IMPRIMETOTGER e R067GRAVASAP
- **Detailed Description of the Rule:** Esta regra gera lancamentos contabeis para integracao com sistema SAP baseados nos totais calculados
- **What it proposes to do:** Criar registros de debito e credito para cada tipo de operacao no formato SAP
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. **Calculo de Totais para SAP:**
     - WSTOTALCREDI = WSTOTCREDINCLU + WSTOTCREDTRANS (inclusoes e transferencias)
     - WSTOTALCREDB = WSTOTCREDBAIXA + WSTOTCREDEXCL (baixas e exclusoes)

  2. **Geracao de Lancamento para Inclusoes/Transferencias (se WSTOTALCREDI > 0):**
     - Codigo SAP = 4412
     - Conta Debito = WSCTDEBITO4412
     - Conta Credito = WSCTCREDITO4412
     - Valor = WSTOTALCREDI
     - Chamar R067GRAVASAP

  3. **Geracao de Lancamento para Baixas/Exclusoes (se WSTOTALCREDB > 0):**
     - Codigo SAP = 3412
     - Conta Debito = WSCTDEBITO3412
     - Conta Credito = WSCTCREDITO3412
     - Valor = WSTOTALCREDB
     - Chamar R067GRAVASAP

  4. **Geracao de Lancamento para Registros Contabeis (se WSTOTCREDREGCTB > 0):**
     - Codigo SAP = 3413
     - Conta Debito = WSCTDEBITO3413
     - Conta Credito = WSCTCREDITO3413
     - Valor = WSTOTCREDREGCTB
     - Chamar R067GRAVASAP

  5. **Estrutura do Registro SAP (R067GRAVASAP):**
     - WS012CORPORA = "E04"
     - WS012DIA = dia da data de processamento
     - WS012MES = mes da data de processamento
     - WS012ANO = ano da data de processamento (2 digitos)
     - WS012FIL = 00
     - WS012EVENTO = "GO002A"
     - WS012DTREF = data completa de processamento
     - WS012VALOR = valor calculado
     - WS012TDOC = "GO"
     - Para cada lancamento, gerar 2 registros:
       - Registro DEBITO: WS012DC = "D", WS012CONTA = conta debito
       - Registro CREDITO: WS012DC = "C", WS012CONTA = conta credito
     - Se codigo <> 4412: WS012CL = " ", centros em branco
     - Senao: WS012CL = "L", WS012CENTRO1 = "130", WS012CENTRO2 = "100"