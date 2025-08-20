- **id**: 68a50e7a2479b3f77c3ad59e
- **idProjects**: 68a50e7a2479b3f77c3ad59e
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e7a2479b3f77c3ad59c
- **order**: 2
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-53-08.097__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Develop Calculations for Debit Transactions by Status
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement calculations for debit transactions based on their status. This functionality will ensure that debit transactions are processed correctly according to the rules provided. For Status 2 (Baixa), calculate WSVLRDEBBAIXA = ATNDVALORCR and increment WSQTDEBAIXA by 1. For Status 5 (Reg.Contabil), calculate WSVLRDEBREGCTB = ATNDVALORCR, increment WSQTDEREGCTB and WSQTDE1REGCTB by 1. For other statuses, calculate WSVLRDEBEXCL = ATNDVALORCR and increment WSQTDEEXCL by 1.
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
- **value**: The system correctly calculates WSVLRDEBBAIXA, WSVLRDEBREGCTB, and WSVLRDEBEXCL based on the transaction status. The system correctly increments WSQTDEBAIXA, WSQTDEREGCTB, WSQTDE1REGCTB, and WSQTDEEXCL as per the rules. Unit tests are implemented to validate the calculations for various statuses and edge cases.
- **values**: null


- **parent**: null
