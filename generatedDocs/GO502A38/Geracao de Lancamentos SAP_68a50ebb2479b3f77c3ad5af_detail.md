- **id**: 68a50ebb2479b3f77c3ad5af
- **idProjects**: 68a50ebb2479b3f77c3ad5af
- **projectId**: PoC - Agile
- **levelTypeId**: UserStory
## levelTypeIdNext
- **0**: Task
- **1**: Test

- **parentId**: null
- **useCaseId**: 68a50ebb2479b3f77c3ad5aa
- **order**: 5
- **blocked**: false
- **integrated**: false
- **jobId**: 2025-08-19__23-54-02.722__Agile
- **externalId**: null
## fields
## 0
- **alias**: Title
- **type**: title
- **name**: Title
- **value**: Develop SAP Record Structure in R067GRAVASAP
- **values**: null

## 1
- **alias**: Description
- **type**: multiline
- **name**: Description
- **value**: This user story focuses on developing the SAP record structure in the R067GRAVASAP function. The structure includes fields such as WS012CORPORA, WS012DIA, WS012MES, WS012ANO, WS012FIL, WS012EVENTO, WS012DTREF, WS012VALOR, and WS012TDOC. For each financial entry, two records should be generated: one for debit (WS012DC = D, WS012CONTA = debit account) and one for credit (WS012DC = C, WS012CONTA = credit account). If the SAP code is 4412, WS012CL should be blank; otherwise, WS012CL should be 'L' with WS012CENTRO1 = 130 and WS012CENTRO2 = 100. This ensures that the SAP records are correctly structured and formatted for integration.
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
- **value**: - Develop the SAP record structure in the R067GRAVASAP function with all required fields.
- Ensure two records are generated for each financial entry: one for debit and one for credit.
- Validate that WS012CL is blank for SAP code 4412 and 'L' with WS012CENTRO1 = 130 and WS012CENTRO2 = 100 for other codes.
- Ensure the records are correctly formatted and ready for SAP integration.
- **values**: null


- **parent**: null
