- **id**: 68a4e3a42479b3f77c3ad563
- **idProjects**: 68a4e3a42479b3f77c3ad563
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a4e3a42479b3f77c3ad55f
- **order**: 4
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__20-50-17.978__Agile
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
- **value**: As a developer, I want to implement the logic for classifying transactions with regularization from previous days so that the system can correctly categorize and calculate totals for these transactions. 
- The logic should identify transactions where ATDTREGULAR is not equal to PKDTDTPROC and WSATSFSTATUS equals 1. 
- Call R050VESTATUS to define the status description. 
- Print details for the transaction. 
- Apply calculations based on the final status.
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
- **value**: - The system correctly identifies and classifies transactions with regularization from previous days.
- The R050VESTATUS routine is called to define the status description.
- Details are printed accurately for each transaction.
- Calculations are applied accurately based on the final status.
- **values**: null


- **parent**: null
