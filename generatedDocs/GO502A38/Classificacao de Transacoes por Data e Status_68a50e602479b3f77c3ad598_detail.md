- **id**: 68a50e602479b3f77c3ad598
- **idProjects**: 68a50e602479b3f77c3ad598
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e602479b3f77c3ad595
- **order**: 3
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-52-40.789__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Same-Day Regularization Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement the logic for classifying transactions with same-day regularization based on processing date and status so that the system can correctly categorize and calculate totals for these transactions. This includes:
- Checking if ATDTPROCSUSP equals PKDTDTPROC and ATDTREGULAR equals PKDTDTPROC and WSATSFSTATUS equals 1.
- Calling R037VERIFABSORCAO to verify absorption.
- Defining the description as 'ABSORCAO' if absorption exists, otherwise using the transaction description.
- Defining an additional description as 'INCLUIDO DIA'.
- Printing details twice for inclusion and regularization.
- Applying calculations based on the final status.
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
- **value**: - The system correctly identifies transactions with same-day regularization based on the provided criteria.
- Absorption is verified using R037VERIFABSORCAO.
- The correct descriptions are assigned based on the conditions.
- Details are printed twice for inclusion and regularization.
- Calculations are applied correctly based on the final status.
- **values**: null


- **parent**: null
