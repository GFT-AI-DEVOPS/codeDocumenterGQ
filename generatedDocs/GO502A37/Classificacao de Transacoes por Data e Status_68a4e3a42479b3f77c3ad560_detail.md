- **id**: 68a4e3a42479b3f77c3ad560
- **idProjects**: 68a4e3a42479b3f77c3ad560
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a4e3a42479b3f77c3ad55f
- **order**: 1
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__20-50-17.978__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Pending Transactions Classification Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement the logic for classifying pending transactions so that the system can correctly categorize and calculate totals for transactions marked as pending. 
- The logic should identify transactions where ATDTPROCSUSP is equal to PKDTDTPROC and WSATSFSTATUS equals 1. 
- Define the description as 'PENDENTE'. 
- Increment the WSQTDESALDOATU counter by 1. 
- If FKNICODLANC is between 999 and 2000, add ATNDVALORCR to WSVLRDEBATU; otherwise, add ATNDVALORCR to WSVLRCREDATU. 
- Ensure the routine exits after processing.
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
- **value**: - The system correctly identifies and classifies pending transactions.
- The WSQTDESALDOATU counter is incremented accurately.
- The correct totals are calculated and added to either WSVLRDEBATU or WSVLRCREDATU based on the FKNICODLANC range.
- The routine exits after processing each transaction.
- **values**: null


- **parent**: null
