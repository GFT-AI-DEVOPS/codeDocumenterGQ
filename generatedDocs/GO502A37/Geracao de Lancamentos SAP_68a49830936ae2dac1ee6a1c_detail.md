- **id**: 68a49830936ae2dac1ee6a1c
- **idProjects**: 68a49830936ae2dac1ee6a1c
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a49830936ae2dac1ee6a1a
- **order**: 2
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__15-28-13.811__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Create SAP Entry Generation for Inclusions and Transfers
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a financial system user, I want the system to generate SAP accounting entries for inclusions and transfers so that these operations are properly recorded in the SAP system. When WSTOTALCREDI is greater than 0, the system should create an accounting entry with SAP code 4412, using the configured debit account (WSCTDEBITO4412) and credit account (WSCTCREDITO4412), with the calculated total value (WSTOTALCREDI). The system must call the R067GRAVASAP function to persist the entry data. This functionality ensures that all inclusion and transfer operations are accurately reflected in the SAP accounting system with proper debit and credit balancing.
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
- **value**: System checks if WSTOTALCREDI is greater than 0. System generates SAP entry with code 4412 for inclusions/transfers. System uses correct debit account WSCTDEBITO4412. System uses correct credit account WSCTCREDITO4412. System sets entry value to WSTOTALCREDI. System calls R067GRAVASAP function to save the entry. Entry generation is logged for audit trail.
- **values**: null


- **parent**: null
