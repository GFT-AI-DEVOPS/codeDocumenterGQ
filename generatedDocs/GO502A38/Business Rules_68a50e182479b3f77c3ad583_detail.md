- **id**: 68a50e182479b3f77c3ad583
- **idProjects**: 68a50e182479b3f77c3ad583
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50e182479b3f77c3ad580
- **order**: 3
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-51-29.680__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Implement Debit and Credit Classification
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a developer, I want to classify transactions as debit or credit based on the FKNICODLANC field so that transactions with codes between 999 and 2000 are classified as debit, and others as credit. This classification will affect totalizers and the accounting accounts used.
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
- Transactions are classified as credit if the FKNICODLANC code is outside the range of 999 to 2000.
- The classification impacts totalizers and accounting accounts correctly.
- The logic is tested with various transaction codes.
- **values**: null


- **parent**: null
