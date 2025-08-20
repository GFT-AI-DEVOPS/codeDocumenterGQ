- **id**: 68a50e7a2479b3f77c3ad5a0
- **idProjects**: 68a50e7a2479b3f77c3ad5a0
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e7a2479b3f77c3ad59c
- **order**: 4
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-53-08.097__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Calculations for Inclusion Transactions
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement calculations for inclusion transactions based on the WSATNISUSPENSOANTNN flag. This functionality will ensure that inclusion transactions are processed correctly according to the rules provided. If WSATNISUSPENSOANTNN equals 1, calculate WSVLRDEBINCLU = ATNDVALORCR for DEBITO and WSVLRCREDINCLU = ATNDVALORCR for CREDITO. Otherwise, calculate WSVLRDEBTRANS = ATNDVALORCR for DEBITO and WSVLRCREDTRANS = ATNDVALORCR for CREDITO.
- **values**: null

## 2
- **alias**: Story Points
- **type**: int
- **name**: StoryPoints
- **value**: 3
- **values**: null

## 3
- **alias**: Acceptance Criteria
- **type**: multiline
- **name**: AcceptanceCriteria
- **value**: The system correctly calculates WSVLRDEBINCLU and WSVLRCREDINCLU when WSATNISUSPENSOANTNN equals 1. The system correctly calculates WSVLRDEBTRANS and WSVLRCREDTRANS when WSATNISUSPENSOANTNN does not equal 1. Unit tests are implemented to validate the calculations for various edge cases and inputs.
- **values**: null


- **parent**: null
