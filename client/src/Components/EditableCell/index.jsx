import React, { useState } from 'react'
import TableCell from '@material-ui/core/TableCell'
import { CircularProgress, IconButton, TextField, Tooltip } from '@material-ui/core'
import { CheckCircle, Edit, Save, Close } from '@material-ui/icons'
import { cleanFieldName, isNull, successMessage } from '../../utils/pdfHelpers'
import { secureApi } from '../../Config/api'
import { PDF_APIS } from '../../utils/apis'
const str_validated_field_name = 'validated_field_name'
const str_validated_field_value = 'validated_field_value'

const { POST: { UPDATE_KEY_PAIRS } } = PDF_APIS
const EditableTableCell = ({ is_editable, setFinalText, Loading, isFieldName, refresh, key_pair, onSave, dontEditBigquery, errorMessage, ...props }) => {
    const f_n = key_pair?.field_name
    const f_v = key_pair?.field_value
    const v_f_n = key_pair?.validated_field_name
    const v_f_v = key_pair?.validated_field_value
    const id = key_pair?.id
    const d_i_t = key_pair?.dlp_info_type
    const d_m_l = key_pair?.dlp_match_likelihood

    let hasError = errorMessage && errorMessage?.length ? true : false
    const field = isFieldName ? (isNull(v_f_n) ? (f_n || 'undefined') : v_f_n) : isNull(v_f_v) ? (f_v || 'undefined') : v_f_v

    const [text, setText] = useState(field)
    const [loading, setIsLoading] = useState(false)
    const [editable, setIsEditable] = useState(Boolean(is_editable))
    const [isEdit, setIsEdit] = useState(false)

    const isEditable = editable && is_editable !== false

    const isLoading = loading || Loading
    const shouldShowSave = Boolean((isFieldName ? f_n : f_v)?.trim()?.toLowerCase() !== text?.trim()?.toLowerCase())
    let onSAVE = typeof onSave == "function" ? onSave : () => console.log("Missing Props 'onSave' from component EditableCell")
    let updateNow = () => {
        setIsLoading(true)
        if (props?.setIsLoading) props.setIsLoading(true);
        secureApi.post(UPDATE_KEY_PAIRS, { id, [isFieldName ? str_validated_field_name : str_validated_field_value]: text })
            .then(results => {
                setIsLoading(false)
                setIsEdit(false)
                setIsEditable(false)
                if (props?.setIsLoading) props.setIsLoading(false);

                if (results.success) {
                    successMessage(`Succesfully updated field!`)
                    if (typeof refresh == 'function') refresh()
                }
                else {
                    errorMessage(results.message || 'Something went wrong!')
                    console.log(`Received Success false from server,`, results)
                }
            })
            .catch(e => {
                errorMessage(e.message || 'Something went wrong!')
                console.log('Error occurred in updateNow funciton in EditableTableCell.jsx ', e)
                setIsLoading(false)
            })
    }

    let erroredColor = hasError ? { color: 'white', fontWeight: 'bold', fontSize: 18 } : {}
    let fielddd = text || field || 'undefined'
    return (
        <TableCell align='right'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                {(isEditable && isEdit) ? (
                    <TextField
                        style={{ width: '70%', minWidth: 80, ...erroredColor }}
                        value={text}
                        label={isFieldName ? 'Field Name' : 'Field Value'}
                        id='filled-size-small'
                        defaultValue='Small'
                        variant='standard'
                        size='small'
                        onChange={e => {
                            let gottenText = e?.target?.value?.trim() || ''

                            let cleanedText = cleanFieldName(gottenText)
                            setText(isFieldName ? cleanedText : gottenText)

                        }}
                    />
                ) : (
                    <Tooltip title={fielddd}>
                        <p style={{ maxWidth: 650, overflow: 'hidden', textOverflow: 'ellipsis', ...erroredColor }}>   {fielddd}</p>
                    </Tooltip>
                )
                }
                {Boolean(isEditable && isEdit) && (
                    <IconButton disabled={isLoading} style={{ padding: 5, ...erroredColor }} onClick={() => {
                        setText(field)
                        setIsEdit(false)
                    }} >
                        <Close />
                    </IconButton>
                )}
                {isEditable ? (
                    isLoading ? (
                        <CircularProgress size={25} />
                    ) : (
                        <>
                            {!isEdit && (
                                <IconButton disabled={isLoading} style={{ padding: 5, ...erroredColor }} onClick={() => setIsEdit(true)} >
                                    <Edit />
                                </IconButton>
                            )}

                            {(isEdit && shouldShowSave) && (
                                <IconButton disabled={isLoading} style={{ padding: 5 }} onClick={() => {
                                    if (typeof setFinalText == 'function') setFinalText({ id, text, isFieldName })
                                    if (dontEditBigquery !== true) updateNow();

                                    if (dontEditBigquery == true) {
                                        setIsLoading(false)
                                        setIsEdit(false)
                                        // setIsEditable(false)
                                    }
                                    if (key_pair) {
                                        onSAVE(Object.assign({}, key_pair, { id, isFieldName, validated_field_name: text }))
                                    } else {
                                        console.log("keypair", key_pair)
                                    }
                                }} >
                                    <Save />
                                </IconButton>)}
                        </>
                    )
                ) : (
                    <Tooltip title='The field is validated by human in the loop.'>
                        <CheckCircle style={{ color: 'green', }} />
                    </Tooltip>
                )

                }
            </div>
        </TableCell>
    )
}

export default EditableTableCell