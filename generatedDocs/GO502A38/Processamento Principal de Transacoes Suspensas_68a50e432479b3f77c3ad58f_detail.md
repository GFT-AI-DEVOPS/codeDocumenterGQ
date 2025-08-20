- **id**: 68a50e432479b3f77c3ad58f
- **idProjects**: 68a50e432479b3f77c3ad58f
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e432479b3f77c3ad58e
- **order**: 1
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-52-18.866__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Transaction Fetch and Loop Termination Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: - Develop functionality to execute a FETCH operation on the cursor REGISTRO to retrieve the next transaction record.
- Implement logic to handle SQLCODE 100 (end of file) by closing the cursor, setting CHAVEFIM to HIGHVALUES, and exiting the main loop.
- Ensure proper error handling for SQLCODE values other than zero, displaying an error message and canceling the operation.
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
- **value**: - The system must successfully fetch the next transaction record using the cursor REGISTRO.
- When SQLCODE equals 100, the cursor must be closed, CHAVEFIM set to HIGHVALUES, and the loop terminated.
- For SQLCODE values other than zero, an error message must be displayed, and the operation canceled.
- **values**: null


- **parent**: null
