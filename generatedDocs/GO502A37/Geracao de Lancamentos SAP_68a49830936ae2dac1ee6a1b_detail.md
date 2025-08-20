- **id**: 68a49830936ae2dac1ee6a1b
- **idProjects**: 68a49830936ae2dac1ee6a1b
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a49830936ae2dac1ee6a1a
- **order**: 1
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__15-28-13.811__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement SAP Totals Calculation Engine
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a financial system user, I want the system to calculate totals for SAP integration so that accounting entries can be properly generated based on different operation types. The system needs to calculate various totals including WSTOTALCREDI (sum of WSTOTCREDINCLU and WSTOTCREDTRANS for inclusions and transfers), WSTOTALCREDB (sum of WSTOTCREDBAIXA and WSTOTCREDEXCL for write-offs and exclusions), and WSTOTCREDREGCTB for accounting records. These calculations serve as the foundation for generating proper debit and credit entries in SAP format. The calculation engine must handle different operation types and ensure accurate totals that will be used by subsequent SAP entry generation processes.
- **values**: null

## 2
- **alias**: Story Points
- **type**: int
- **name**: StoryPoints
- **value**: 5
- **values**: null

## 3
- **alias**: Acceptance Criteria
- **type**: multiline
- **name**: AcceptanceCriteria
- **value**: System calculates WSTOTALCREDI as sum of inclusions and transfers. System calculates WSTOTALCREDB as sum of write-offs and exclusions. System calculates WSTOTCREDREGCTB for accounting records. All calculated totals are available for SAP entry generation. Calculation results are validated and logged for audit purposes.
- **values**: null


- **parent**: null
