- **id**: 68a50e602479b3f77c3ad597
- **idProjects**: 68a50e602479b3f77c3ad597
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e602479b3f77c3ad595
- **order**: 2
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-52-40.789__Agile
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
- **value**: As a developer, I want to implement the logic for classifying daily inclusions based on processing date and status so that the system can correctly categorize and calculate totals for these transactions. This includes:
- Checking if WSATNISUSPENSOANTNN equals 1 to determine whether to increment WSQTDEINCLU and define the description as 'INCLUIDO DIA E PENDENTE'.
- Otherwise, increment WSQTDETRANS and define the description as 'INCL.TRANSF. PENDENTE'.
- Calling R030IMPRIMEDET to print details.
- Incrementing WSQTDESALDOATU.
- Applying the same debit/credit logic as in the pending transactions classification.
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
- **value**: - The system correctly identifies daily inclusions based on the provided criteria.
- WSQTDEINCLU or WSQTDETRANS counters are incremented accurately.
- The correct descriptions are assigned based on the conditions.
- R030IMPRIMEDET is called to print details.
- WSQTDESALDOATU is incremented accurately.
- Debit/credit calculations are applied correctly.
- **values**: null


- **parent**: null
