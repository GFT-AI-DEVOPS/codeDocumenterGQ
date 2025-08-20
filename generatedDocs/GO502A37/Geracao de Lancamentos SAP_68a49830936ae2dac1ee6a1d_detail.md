- **id**: 68a49830936ae2dac1ee6a1d
- **idProjects**: 68a49830936ae2dac1ee6a1d
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a49830936ae2dac1ee6a1a
- **order**: 3
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__15-28-13.811__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Create SAP Entry Generation for Write-offs and Exclusions
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: As a financial system user, I want the system to generate SAP accounting entries for write-offs and exclusions so that these operations are properly recorded in the SAP system. When WSTOTALCREDB is greater than 0, the system should create an accounting entry with SAP code 3412, using the configured debit account (WSCTDEBITO3412) and credit account (WSCTCREDITO3412), with the calculated total value (WSTOTALCREDB). The system must call the R067GRAVASAP function to persist the entry data. This functionality ensures that all write-off and exclusion operations are accurately reflected in the SAP accounting system with proper debit and credit balancing, maintaining financial integrity.
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
- **value**: System checks if WSTOTALCREDB is greater than 0. System generates SAP entry with code 3412 for write-offs/exclusions. System uses correct debit account WSCTDEBITO3412. System uses correct credit account WSCTCREDITO3412. System sets entry value to WSTOTALCREDB. System calls R067GRAVASAP function to save the entry. Entry generation is logged for audit trail.
- **values**: null


- **parent**: null
