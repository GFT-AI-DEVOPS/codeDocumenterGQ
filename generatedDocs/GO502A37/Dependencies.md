## Dependencies

O programa GO502A37 possui diversas dependencias criticas que devem ser consideradas durante o processo de modernizacao. As principais dependencias incluem tabelas de banco de dados DB2, programas utilitarios COBOL, copybooks de estruturas de dados e bibliotecas de funcoes de sistema.

| Dependency | Description | Type | Reference | Relevance for Modernization |
|------------|-------------|------|-----------|----------------------------|
| PAKF023VSUSPENSO | Tabela principal de transacoes suspensas contendo dados de contratos, valores, datas e status | Database Table | AXG1000.PAKF023VSUSPENSO | CRITICA - Estrutura central do sistema, requer mapeamento completo para nova arquitetura |
| PAKF018VCONTROLE | Tabela de controle de processamento com data de processamento atual | Database Table | AXG1000.PAKF018VCONTROLE | ALTA - Controla fluxo de processamento, essencial para logica de negocio |
| PAKF008VCONTRATO | Tabela de contratos com dados de clientes e operacoes | Database Table | AXG1000.PAKF008VCONTRATO | ALTA - Dados mestres de contratos, fundamental para integridade referencial |
| PAKF005VCONLOJ | Tabela de concessionarias e filiais | Database Table | AXG1000.PAKF005VCONLOJ | MEDIA - Dados organizacionais, necessario para agrupamentos |
| PAKF074VABSORCAO | Tabela de processos de absorcao de transacoes | Database Table | AXG1000.PAKF074VABSORCAO | MEDIA - Regra especifica de negocio para tratamento de absorcoes |
| PAKG111VLANCTOCON | Tabela de configuracao de lancamentos contabeis | Database Table | AXG0201.PAKG111VLANCTOCON | ALTA - Parametrizacao contabil, essencial para integracao SAP |
| PAKG002VTIPO | Tabela de tipos e descricoes de motivos | Database Table | AXG0201.PAKG002VTIPO | BAIXA - Dados de apoio para legendas e descricoes |
| YY035A | Programa utilitario para controle de arquivos de saida | External Program | YY035A | MEDIA - Funcionalidade de sistema, pode ser substituida por APIs modernas |
| YY115A | Programa utilitario para obtencao de data e hora do sistema | External Program | YY115A | BAIXA - Funcionalidade basica, facilmente substituivel |
| GN111V00 | Copybook com estrutura da tabela PAKG111VLANCTOCON | COBOL Copybook | INCLUDE GN111V00 | ALTA - Estrutura de dados critica, requer conversao para modelo de dados moderno |
| GN002V00 | Copybook com estrutura da tabela PAKG002VTIPO | COBOL Copybook | INCLUDE GN002V00 | BAIXA - Estrutura simples, facil conversao |
| GO018V00 | Copybook com estrutura da tabela PAKF018VCONTROLE | COBOL Copybook | INCLUDE GO018V00 | ALTA - Estrutura de controle, essencial para logica |
| GO008V00 | Copybook com estrutura da tabela PAKF008VCONTRATO | COBOL Copybook | INCLUDE GO008V00 | ALTA - Estrutura complexa de contratos, requer analise detalhada |
| GO023V00 | Copybook com estrutura da tabela PAKF023VSUSPENSO | COBOL Copybook | INCLUDE GO023V00 | CRITICA - Estrutura principal, base para todo processamento |
| GO005V00 | Copybook com estrutura da tabela PAKF005VCONLOJ | COBOL Copybook | INCLUDE GO005V00 | MEDIA - Estrutura organizacional, importante para hierarquias |
| DB2 Database | Sistema gerenciador de banco de dados IBM DB2 | Database System | IBM DB2 | CRITICA - Toda persistencia de dados, requer estrategia de migracao |
| SQLCA | Area de comunicacao SQL para controle de erros | SQL Component | EXEC SQL INCLUDE SQLCA | ALTA - Controle de transacoes, deve ser adaptado para novo SGBD |