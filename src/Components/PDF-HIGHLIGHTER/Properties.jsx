import { Button, Input, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { secureApi } from '../../Config/api'
import { ARTIFACT } from '../../utils/apis'
import { getUniqueArrayOfObjects } from '../../utils/pdfHelpers'

const { GET: { ADDITIONAL_PROPERTIES }, POST: { UPDATE_ADDITIONAL_PROPERTIES } } = ARTIFACT

const { Option } = Select
const { TextArea } = Input

const Properties = ({ artifactData }) => {
    const [propertiesLoading, setPropertiesLoading] = useState(false)
    const [propertyValues, setPropertyValues] = useState({})
    const [additionalProperties, setAdditionalProperties] = useState()

    const [submitting, setSubmitting] = useState(false)
    const artifact_id = artifactData?.id
    const currentProject = useSelector((state) => state?.artifactReducer?.currentProject)

    useEffect(() => {
        getAdditionalProperties()
    }, [])

    const submitProperties = async () => {
        try {
            setSubmitting(true)
            let d = await secureApi.post(`${UPDATE_ADDITIONAL_PROPERTIES}/${artifact_id}`, propertyValues)
            if (d?.success) {
                console.log('DONE')
            }
            else {
                console.error('UNSUCCESFULL ', d)
            }
        }
        catch (e) {

            console.error(e)
        }
        setSubmitting(false)
    }

    const getAdditionalProperties = () => {
        setPropertiesLoading(true)

        secureApi.get(`${ADDITIONAL_PROPERTIES}/${artifact_id}`)
            .then((data) => {
                let myObject = propertyValues
                if (data?.success) {
                    setAdditionalProperties(data?.data)
                    if (data?.data?.length && Array.isArray(data?.data)) {
                        data.data.forEach(d => {
                            Object.assign(myObject, { [d?.id]: d?.property_value })
                        })
                        setPropertyValues(myObject)
                    }
                }
                else {
                    let errMsg = data?.message
                    errMsg && console.log(errMsg)
                }
            }).finally(() => {
                setPropertiesLoading(false)
            })
    }

    return (
        <div style={{ minHeight: 500, padding: 30, background: 'white' }}>
            <div style={{ marginLeft: 15, marginTop: -15 }}>
                {propertiesLoading ? (
                    <Spin />
                ) : (
                    getUniqueArrayOfObjects(additionalProperties, 'id')?.map((v, i) => {
                        return (
                            <div key={i}>
                                <p style={{ width: 400, margin: 1 }}><b>{v?.property_name}</b> &nbsp; &nbsp;</p>
                                {v?.property_type === 'list' ? (
                                    <Select
                                        disabled={submitting}

                                        showSearch
                                        size='large'
                                        style={{ width: 250 }}
                                        placeholder={v?.property_name}

                                        optionFilterProp='children'
                                        onChange={t => setPropertyValues(Object.assign({ ...propertyValues }, { [v?.id]: t }))}
                                        value={propertyValues?.[v?.id] || ''}
                                        filterOption={(input, option) =>
                                            option?.children?.toLowerCase?.()?.indexOf?.(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            v?.options?.map((y, j) => (
                                                <Option key={j}>
                                                    <div className='rowSpaceBetween'>
                                                        <span>{y}</span>
                                                    </div>
                                                </Option>
                                            ))
                                        }

                                    </Select>) : (<span>
                                        <TextArea
                                            disabled={submitting}
                                            onChange={t => setPropertyValues(Object.assign({ ...propertyValues }, { [v?.id]: t.target.value }))}
                                            value={propertyValues?.[v?.id] || ''}
                                            style={{ width: 250 }}
                                            rows={1} />
                                    </span>)}
                                <br /><br />
                            </div>
                        )
                    }).concat([
                        <Button loading={submitting} disabled={submitting} onClick={submitProperties} type='primary' className='input-btn' style={{ float: 'right', marginTop: 5 }}>
                            Submit
                        </Button>
                    ])
                )}
            </div>
        </div>
    )
}

export default Properties
