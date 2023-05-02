import React, { useState, useMemo } from 'react'
import { Modal, Select, Input, Button, Popconfirm } from 'antd'
import PropTypes from 'prop-types'
import { secureApi } from '../../../Config/api'
import { cleanFieldName, errorMessage, getUniqueArrayOfObjects, successMessage } from '../../../utils/pdfHelpers'
import { Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'
import Table from './table'
import { PDF_APIS } from '../../../utils/apis'
const { Option } = Select
const { POST: { ADD_KEY_PAIRS } } = PDF_APIS;
const AddFieldModal = ({ addedKeyPairs, setCropOptions, setAddedKeyPairs, onClose, artifactData, pageNumber, isTemplateView, refresh, availableKeyPair, rect }) => {

    const userId = useSelector((store) => store?.authReducer?.user?.id)
    const [valueText, setValueText] = useState('')
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState('')

    const addedKeyPairsName = useMemo(() => addedKeyPairs?.map?.(d => d?.field_name) || [], [availableKeyPair, addedKeyPairs])
    const availableKeyPairs = useMemo(() => availableKeyPair?.filter?.(d => addedKeyPairsName?.indexOf(d?.field_name) < 0), [availableKeyPair, addedKeyPairs])

    const [errors, setErrors] = useState({})
    console.log("availableKeyPairs", availableKeyPairs)

    const uniqueAddedKeyPairs = useMemo(() => getUniqueArrayOfObjects(addedKeyPairs, "field_name"), [addedKeyPairs])

    let artifact_name = artifactData?.artifact_name

    const close = () => {
        if (typeof onClose == "function") onClose(false)
    }

    const setError = (id, message) => {
        setErrors({ [`${id}`]: message })
    }



    const hasValidationErrors = () => {
        let hasError = false
        console.log("unqieur", uniqueAddedKeyPairs)
        for (let i = 0; i < uniqueAddedKeyPairs.length; i++) {
            let KeyPair = uniqueAddedKeyPairs?.[i]
            if (!KeyPair?.fRect || !KeyPair?.fRect?.x || !KeyPair?.fRect?.y || !KeyPair?.fRect?.width || !KeyPair?.fRect?.height) {
                setError(KeyPair?.id, "Please select field name's image area.")
                hasError = true
                break;
            }
            if (!KeyPair?.vRect || !KeyPair?.vRect?.x || !KeyPair?.vRect?.y || !KeyPair?.vRect?.width || !KeyPair?.vRect?.height) {
                setError(KeyPair?.id, "Please select field value's image area.")
                hasError = true
                break;
            }
        }


        return hasError
    }
    const ok = async () => {
        if (uniqueAddedKeyPairs?.length && !hasValidationErrors()) {
            setErrors({})
            try {
                setLoading(true)
                let data = await secureApi.post(ADD_KEY_PAIRS, { artifact_name, keyPairs: uniqueAddedKeyPairs, userId })
                let alreadyExisting = data?.existing || []
                if (data?.message) data?.success ? successMessage(data?.message) : errorMessage(data?.message)

                if (data?.success) {
                    if (typeof refresh == "function") refresh()
                    setAddedKeyPairs([])
                    if (alreadyExisting && Array.isArray(alreadyExisting) && alreadyExisting.length) {
                        let moreThan1 = alreadyExisting.length > 1
                        let names = alreadyExisting?.[0]?.field_name
                        if (alreadyExisting.length > 1) {
                            names = alreadyExisting.map(d => d?.field_name + " ")?.toString()
                        }
                        let msg = `Ignored field name${moreThan1 ? 's' : ''}: "${names}" because ${moreThan1 ? 'they already exists.' : 'it is already existing.'} `
                        errorMessage(msg)
                    }
                }
            } catch (e) {
                console.log(e)
            }
            setLoading(false)

            close()

        } else {
            if (!uniqueAddedKeyPairs?.length) errorMessage("Please select field name and write value.")
        }
    }



    const addKeyPair = () => {
        let previouslyAdded = Array.isArray(uniqueAddedKeyPairs) ? uniqueAddedKeyPairs : []
        let field_name = selected
        let field_value = valueText
        let id = btoa(`${field_name}:${field_value}_${new Date().getTime()}`)

        if (field_name?.length && field_value?.length) {
            let newData = [...previouslyAdded, { field_name, field_value, id, pageNumber }]

            setAddedKeyPairs(newData)
            setSelected('')
            setValueText('')
        }
    }



    const SelectField = () => (
        <Select
            showSearch
            style={{ width: 200 }}

            placeholder="Field Name"
            loading={loading}
            disabled={loading}
            optionFilterProp="children"
            onChange={setSelected}
            value={selected}
            filterOption={(input, option) =>
                option?.value?.toLowerCase?.()?.indexOf?.(input?.toLowerCase?.()) >= 0
            }
        >

            {availableKeyPairs?.map?.(d => (
                <Option key={d?.field_name} value={d?.field_name}>
                    <Tooltip title={d?.field_name} arrow>
                        <span>
                            {d?.field_name?.slice(0, 100)}
                        </span>
                    </Tooltip>
                </Option>
            ))}
        </Select>
    )



    return (
        <Modal
            title="Add Form Fields"
            visible={true}
            closable={true}
            onOk={ok}
            okText={`Submit`}
            destroyOnClose
            maskClosable={false}
            confirmLoading={loading}
            onCancel={close}
        >

            {/* <div style={{ display: 'flex', justifyContent: 'center', margin: 15 }}>
                <Tooltip placement="top" title="Your Selection Image" arrow>
                    <img style={{ border: `1px solid #1890ff`, borderRadius: 5 }} src={imgLink} width={`${rect?.width * pageWidth}px`} height={`${rect?.height * pageHeight}px`} />
                </Tooltip>

            </div> */}
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
                <Tooltip placement="top" arrow title="Select an available Field Name.">
                    {Boolean(isTemplateView) ? (
                        <span>
                            <Input
                                disabled={loading}
                                // onKeyUp={e => { if (e.key == "Enter") addKeyPair(); }}
                                placeholder={"Field Name"}
                                style={{ margin: '0px 5px' }}
                                onChange={(e) => setSelected?.(cleanFieldName(e?.target?.value, true))}
                                value={selected} />
                        </span>

                    ) : <SelectField />}
                </Tooltip>
                <Tooltip placement="top" arrow title="Write Field Value">
                    <span>
                        <Input
                            disabled={loading}
                            // onKeyUp={e => { if (e.key == "Enter") addKeyPair(); }}
                            placeholder={"Field Value"}
                            style={{ margin: '0px 5px' }}
                            onChange={(e) => setValueText?.(e?.target?.value)}
                            value={valueText} />
                    </span>
                </Tooltip>
                <Button disabled={loading} loading={loading} onClick={addKeyPair}>Add +</Button>

            </div>

            {Boolean(uniqueAddedKeyPairs?.length) && <Table errors={errors} setCropOptions={setCropOptions} setAddedKeyPairs={setAddedKeyPairs} addedKeyPairs={uniqueAddedKeyPairs} size="small" />}

        </Modal>
    )
}


AddFieldModal.propTypes = {
    onClose: PropTypes.func,
    uniqueAddedKeyPairs: PropTypes.array,
    setAddedKeyPairs: PropTypes.func,
    setCropOptions: PropTypes.func,
    isTemplateView: PropTypes.bool

}
export default AddFieldModal
