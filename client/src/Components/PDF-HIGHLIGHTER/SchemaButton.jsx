import { Button } from 'antd'
import { secureApi } from '../../Config/api'
import React, { useEffect, useState } from 'react'
import { errorNotification, successMessage, successNotification } from '../../utils/pdfHelpers'
import TableDialog from './TableDialog'
import { PDF_APIS } from '../../utils/apis'
const { POST: { GENERATE_TABLE } } = PDF_APIS;
const SchemaButton = ({ is_editable, isSchemaGenerated, artifactData ,refresh}) => {
    const [accuracy, setaccuracy] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [tableId, setTableId] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [schemaOBJ, setSchemaOBJ] = useState({})
    const file_name = artifactData?.file_name
    let isAccurate = accuracy >= 100
    useEffect(() => {
        // getAccuracy()
        //  generateSchemaTable(false)

    }, [])

    const generateSchema = () => {
        setIsLoading(true)
        refresh()
        setIsLoading(false)
        // secureApi.post(GENERATE_TABLE, { file_name })
        //     .then((data) => {
        //         /** * {
        //             "success": true,
        //             "data": {
        //                 "tableId": "4125aa4a-e992-4c62-8f79-202e059ecd0b",
        //                 "accuracy": 100
        //             }
        //         }
        //          */
        //         // if (data?.success) {
        //         //let { accuracy, tableId } = data?.data
        //         //if (accuracy && tableId) {
        //         // setaccuracy(accuracy)
        //         //  setTableId(tableId)
        //         // }
        //         if (data?.success) {
        //             successMessage(data?.message)
        //         } else {
        //             let errMsg = data?.message;
        //             errMsg && errorNotification(errMsg);
        //         }

        //         // } else {
        //         //     console.log(data)
        //         // }
        //         setIsLoading(false)

        //     })
        //     .catch(err => {
        //         console.log('error while generateing schematable ', err)
        //         let errMsg = err?.response?.data?.message;
        //         errMsg && errorNotification(errMsg);
        //         setIsLoading(false)
        //     })
    }

    // const generateSchemaTable = (shouldWriteInBQ = true) => {
    //     setIsLoading(true)
    //     setShowDialog(false)
    //     secureApi.get(`https://us-central1-${projectId}.cloudfunctions.net/pdf_schema_table_generator?file_name=${file_name}${shouldWriteInBQ ? '&should_insert_bigquery=true' : ''}`).then(({ data }) => {
    //         if (data?.success) {
    //             if (shouldWriteInBQ) {
    //                 successNotification('Schema Table Generated!')

    //                 getAccuracy()
    //             }
    //             setSchemaOBJ(data?.data?.validatedSchemaOBJ)

    //         } else {
    //             if (data?.message) errorNotification(data.message);
    //             setIsLoading(false)

    //         }

    //     }).catch(e => {
    //         console.log('error while generateing schematable ', e)
    //         if (e?.message) errorNotification(e.message);
    //     })
    // }

    //     const updateTable = () => {
    //        file_name=form-fcd2aa7b-96f2-4a1b-9a18-dcf08ed7602c-Fall 2020_MGT101_1 (4).pdf&tableId=82578181-0b08-4096-87ee-530cc3be812a
    //         setIsLoading(true)
    //         secureApi.get(`https://us-central1-${projectId}.cloudfunctions.net/pdf_schema_table_generator?file_name=${file_name}&tableId=${tableId}`)
    //             .then(({ data }) => {
    //                 setIsLoading(false)
    // //                getAccuracy()
    //                 if (data?.success) {
    //                     successNotification("Schema Successfully Saved")
    //                 }
    //             }).catch(e => {
    //                 console.log(e)
    //                 setIsLoading(false)
    //             })

    // }

    // const generateSchema = () => {
    //     if (!is_editable && !isSchemaGenerated) {
    //         if (!isLoading) {
    //             if (accuracy < 100) { //Create new Table

    //                 setShowDialog(true)
    //             } else if (accuracy >= 100 && tableId) {
    //                 updateTable()
    //             } else {
    //                 console.log("NONE FOUND~~~~!")
    //             }
    //         }
    //     }
    //     else {
    //         alert(is_editable ? "Please validate first! (Temporary alert,  UI in-progress.) " : "SCHEMA ALREADY GENERATED (Temporary alert,  UI in-progress.)")
    //     }

    // }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                {/* <Button loading={isLoading} disabled={isLoading} onClick={generateSchema} variant="contained" >
                    DLP / GENERATE SCHEMA
                </Button> */}

            </div>
            {
                // (showDialog && schemaOBJ) && (
                //     <TableDialog closeModal={() => setShowDialog(false)} schemaOBJ={schemaOBJ} save={generateSchemaTable} />
                // )

            }

        </>


    )
}

export default SchemaButton
