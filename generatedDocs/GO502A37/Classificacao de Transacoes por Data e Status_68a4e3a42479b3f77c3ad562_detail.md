- **id**: 68a4e3a42479b3f77c3ad562
- **idProjects**: 68a4e3a42479b3f77c3ad562
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a4e3a42479b3f77c3ad55f
- **order**: 3
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__20-50-17.978__Agile
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
- **value**: As a developer, I want to implement the logic for classifying transactions with same-day regularization so that the system can correctly categorize and calculate totals for these transactions. 
- The logic should identify transactions where ATDTPROCSUSP is equal to PKDTDTPROC, ATDTREGULAR is equal to PKDTDTPROC, and WSATSFSTATUS equals 1. 
- Call R037VERIFABSORCAO to verify absorption. 
- If absorption exists, define the description as 'ABSORCAO'; otherwise, use the description from the transaction entry. 
- Define an additional description as 'INCLUIDO DIA'. 
- Print details twice: once for inclusion and once for regularization. 
- Apply calculations based on the final status.
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
- **value**: - The system correctly identifies and classifies transactions with same-day regularization.
- The R037VERIFABSORCAO routine is called to verify absorption.
- The correct descriptions are assigned based on the absorption check and transaction entry.
- Details are printed twice as required.
- Calculations are applied accurately based on the final status.
- **values**: null


- **parent**: null
