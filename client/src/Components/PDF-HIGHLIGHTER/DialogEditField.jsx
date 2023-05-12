import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { isNull } from '../../utils/pdfHelpers'
import { Spin } from 'antd'
import { secureApi } from '../../Config/api'
import { POST } from '../../utils/apis'
import Table from './Table'

const FormDialog = ({ closeDialog, data, onSave, is_editable, artifactData }) => {
    let id = data?.field_name_id || data?.field_value_id
    let field_name = data?.field_name
    let field_value = data?.field_value
    let is_field_name_editable = isNull(data?.validated_field_name) && is_editable
    let is_field_value_editable = isNull(data?.validated_field_value) && is_editable

    const [fieldName, setFieldName] = useState(field_name || '')
    const [fieldValue, setFieldValue] = useState(field_value || '')
    const [isLoading, setIsLoading] = useState(false)

    const refresh = () => {
        if (typeof onSave == 'function') onSave()

    }
    const close = () => {
        if (typeof closeDialog == 'function') {
            closeDialog()
        }
    }
    useEffect(() => {
        secureApi.post(POST?.UPDATE_KEY_PAIRS, { file_id: artifactData?.id, key_name: field_name })
            .then((res) => {
                const { data } = res
            })
            .catch((err) => {
                console.log(err)
            })
        console.log("UPDATE CNFIDENEE==>")
    }, [])

    // let updateNow = (isFieldName) => {
    //     setIsLoading(true)
    //     secureApi.post(parseURL(`${allAPIs.update_key_pair}`), { id, [str_validated_field_name]: fieldName, [str_validated_field_value]: fieldValue })
    //         .then(data => {
    //             let results = data?.data
    //             setIsLoading(false)
    //             if (typeof onSave == 'function') onSave()

    //             if (results.success) {
    //                 successMessage(`Succesfully updated field!`)
    //                 if (typeof refresh == 'function') refresh()
    //             }
    //             else {
    //                 errorMessage(results.message || 'Something went wrong!')
    //                 console.log(`Received Success false from server,`, results)
    //             }

    //             close()
    //         })
    //         .catch(e => {
    //             errorMessage(e.message || 'Something went wrong!')
    //             console.log('Error occurred in updateNow funciton in EditableTableCell.jsx ', e)
    //             setIsLoading(false)
    //         })
    // }
    //const KeyPairTable = ({ key_pairs, is_editable = true, refresh, isDLP, isSchemaGenerated, artifactData }) => {

    return (
        <Dialog fullWidth={true} maxWidth={'md'} open={true} onClose={close} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Adjudicate</DialogTitle>
            <div style={{ padding: 20, minWidth: 300 }}>

                {/* <EditableTableCell setIsLoading={setIsLoading} isFieldName refresh={refresh} is_editable={is_field_name_editable} key_pair={data} />
                <EditableTableCell setIsLoading={setIsLoading} refresh={refresh} is_editable={is_field_value_editable} key_pair={data} /> */}
                <Table artifactData={artifactData} key_pairs={[data]} is_editable={is_editable} refresh={refresh} justTable={true} />

            </div>
            <DialogActions>
                <div className='modal-last-btn'>
                    <Button className='modal-savebtn'> Save</Button>

                    <Button disabled={isLoading} onClick={close} color='primary'>
                        {isLoading && <Spin />}   {isLoading ? 'Loading...' : 'Close'}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default FormDialog