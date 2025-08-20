## Business Rules

O programa implementa as seguintes regras de negocio para processamento de transacoes suspensas:

**Selecao de Registros**: O sistema busca transacoes da tabela PAKF023VSUSPENSO onde a data de processamento da suspensao ou data de regularizacao seja igual a data de processamento atual, ou onde o status da transacao seja diferente de 1 (pendente) e 6 (cancelado), e a situacao seja diferente de 'C' (cancelado).

**Classificacao por Status**: As transacoes sao classificadas conforme o campo ATSFSTATUS: Status 1 = Pendente, Status 2 = Baixa, Status 3 = Regularizado, Status 4 = Residuo, Status 5 = Registro Contabil. Para cada status, o sistema aplica regras especificas de contabilizacao e totalizacao.

**Separacao Debito/Credito**: O sistema determina se uma transacao e debito ou credito baseado no codigo de lancamento (FKNICODLANC). Se o codigo estiver entre 999 e 2000, a transacao e classificada como debito, caso contrario como credito. Esta classificacao afeta os totalizadores e as contas contabeis utilizadas.

**Calculo de Saldos**: O sistema calcula saldo anterior subtraindo do saldo atual as inclusoes, transferencias, baixas, exclusoes e registros contabeis do dia. O saldo da conta e calculado como a diferenca entre creditos e debitos atuais.

**Integracao SAP**: Para cada tipo de transacao, o sistema gera lancamentos contabeis para o SAP utilizando contas especificas: Codigo 3412 para baixas e exclusoes, Codigo 3413 para registros contabeis, Codigo 4412 para inclusoes e transferencias. Cada lancamento gera um par debito/credito com as contas correspondentes.

**Controle de Absorcao**: O sistema verifica na tabela PAKF074VABSORCAO se existe processo de absorcao ativo para a transacao suspensa. Se existir, a descricao da transacao e alterada para "ABSORCAO".

**Agrupamento por Filial**: Os relatorios sao organizados por filial, gerando subtotais para cada filial antes de processar a proxima. Quando ha mudanca de filial, o sistema imprime o resumo da filial anterior e reinicia os contadores.

**Validacao de Campos Nulos**: O sistema trata campos nulos (valores negativos retornados pelo banco) convertendo-os para zeros ou espacos conforme apropriado, garantindo integridade dos dados processados.

**Geracao de Legendas**: Ao final do processamento, o sistema gera legendas explicativas consultando a tabela PAKG002VTIPO, mostrando os codigos de motivo e suas descricoes correspondentes.

**Controle de Paginacao**: O relatorio controla quebras de pagina automaticamente, imprimindo cabecalhos a cada 55 linhas e numerando as paginas sequencialmente.
