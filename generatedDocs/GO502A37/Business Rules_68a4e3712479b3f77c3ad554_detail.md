- **id**: 68a4e3712479b3f77c3ad554
- **idProjects**: 68a4e3712479b3f77c3ad554
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a4e3712479b3f77c3ad551
- **order**: 3
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__20-49-34.185__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Debit and Credit Separation Logic
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to implement the logic for separating transactions into debit and credit categories based on the FKNICODLANC field, so that the system can correctly classify transactions and update totalizers and accounting accounts. Transactions with codes between 999 and 2000 should be classified as debit, while others should be classified as credit.
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
- **value**: - Transactions are classified as debit if the FKNICODLANC code is between 999 and 2000.
- Transactions are classified as credit if the FKNICODLANC code is outside the 999-2000 range.
- Totalizers and accounting accounts are updated based on the classification.
- The logic is tested and verified with sample data.
- **values**: null


- **parent**: null
