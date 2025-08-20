- **id**: 68a4e3a42479b3f77c3ad561
- **idProjects**: 68a4e3a42479b3f77c3ad561
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a4e3a42479b3f77c3ad55f
- **order**: 2
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__20-50-17.978__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Daily Inclusions Classification Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement the logic for classifying daily inclusions so that the system can correctly categorize and calculate totals for transactions included on the same day. 
- The logic should identify transactions where ATDTPROCSUSP is equal to PKDTDTPROC and WSATSFSTATUS equals 1. 
- If WSATNISUSPENSOANTNN equals 1, increment WSQTDEINCLU by 1 and define the description as 'INCLUIDO DIA E PENDENTE'. 
- Otherwise, increment WSQTDETRANS by 1 and define the description as 'INCL.TRANSF. PENDENTE'. 
- Call R030IMPRIMEDET to print details. 
- Increment WSQTDESALDOATU by 1. 
- Apply the same debit/credit logic as in the pending transactions classification.
- **values**: null

## 2
- **alias**: Story Points
- **type**: int
- **name**: StoryPoints
- **value**: 8
- **values**: null

## 3
- **alias**: Acceptance Criteria
- **type**: multiline
- **name**: AcceptanceCriteria
- **value**: - The system correctly identifies and classifies daily inclusions.
- The WSQTDEINCLU and WSQTDETRANS counters are incremented accurately based on the conditions.
- The correct descriptions are assigned to the transactions.
- The R030IMPRIMEDET routine is called to print details.
- The WSQTDESALDOATU counter is incremented accurately.
- The debit/credit logic is applied correctly.
- **values**: null


- **parent**: null
