- **id**: 68a50e602479b3f77c3ad599
- **idProjects**: 68a50e602479b3f77c3ad599
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e602479b3f77c3ad595
- **order**: 4
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-52-40.789__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Previous-Day Regularization Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement the logic for classifying transactions with regularization from previous days based on processing date and status so that the system can correctly categorize and calculate totals for these transactions. This includes:
- Checking if ATDTREGULAR is less than PKDTDTPROC and WSATSFSTATUS equals 1.
- Calling R050VESTATUS to define the status description.
- Printing details for the transaction.
- Applying calculations based on the final status.
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
- **value**: - The system correctly identifies transactions with regularization from previous days based on the provided criteria.
- The status description is defined using R050VESTATUS.
- Details are printed accurately for the transaction.
- Calculations are applied correctly based on the final status.
- **values**: null


- **parent**: null
