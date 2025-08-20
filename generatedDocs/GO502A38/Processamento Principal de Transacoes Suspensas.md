**2. Rule: Processamento Principal de Transacoes Suspensas**
- **Function/Method Name:** R020PROCESSA
- **Detailed Description of the Rule:** Esta regra processa cada registro de transacao suspensa, aplicando logica de classificacao por status e calculando totalizadores
- **What it proposes to do:** Processar individualmente cada transacao e aplicar regras de negocio especificas
- **Rule Status:** Relevant for Modernization
- **Algorithm:**
  1. Executar FETCH no cursor REGISTRO para obter proximo registro
  2. Se SQLCODE = 100 (fim de arquivo):
     - Fechar cursor REGISTRO
     - Definir CHAVEFIM = HIGH-VALUES para encerrar loop principal
     - Sair da rotina
  3. Se SQLCODE diferente de zero, exibir erro e cancelar
  4. Se ATNICODSAP >= 4400, pular registro (ir para fim da rotina)
  5. Incrementar contador CTLIDOS em 1
  6. Chamar R025VERIFICACAMPOS para validar campos nulos
  7. Se ATNICODSAP > 0, chamar R094SELECTLANCTOCON para obter descricao
  8. Chamar R095ACESSATIPO para obter descricao do tipo
  9. Verificar mudanca de filial:
     - Se WSFILIALANT diferente de FKNDFILIAL atual:
       - Imprimir resumo da filial anterior
       - Definir CTLIN = 70 para forcar nova pagina
       - Atualizar WSFILIALANT com filial atual
  10. Aplicar logica de processamento baseada em datas e status (ver regras especificas)