import React, { useState, useRef } from 'react'
import { Button, Select, List, Checkbox, Input } from 'antd'
import PropTypes from 'prop-types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { PlusOutlined } from '@ant-design/icons'
import Grid from '@mui/material/Grid'
import { secureApi } from '../../Config/api'
import { POST } from '../../utils/apis'
import { awsRegions } from '../../utils/constants'
import { errorMessage, warningMessage, successMessage, validateLength, convertTitle } from '../../utils/helpers'

const { Option } = Select

const buttonStyle = { width: 140 }

const S3Upload = (props) => {
    const { goBack, templateData, handleCancel, threshold, submissionName } = props
    const [loading, setLoading] = useState(false)
    const [serviceKey, setServiceKey] = useState(null)
    const [buckets, setBuckets] = useState([])
    const [bucket, setBucket] = useState(null)
    const [filePath, setFilePath] = useState(null)
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState({})
    const [formData, setFormData] = useState({
        accessKey: 'AKIAXDRCP5EDAECGYDVI',
        secretKey: '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',
        bucketName: 'doc-ai-test'
    })
    const draggerRef = useRef(null)

    const normServiceKey = (e) => {
        let type = 'application/json'
        let file = e?.target?.files?.[0]

        if (!file || file?.type !== type) {
            return warningMessage('Please Upload a Valid File!')
        }

        setServiceKey(file)
    }

    const getBucketData = () => {

        secureApi.post(POST?.GET_S3_BUCKET_DATA, formData)
            .then((data) => {
                console.log('data', data)
                setFiles(data?.files || [])
            })
            .catch(error => {
                console.log('ERROR', error)
            })
    }

    const uploadFiles = (obj) => {
        secureApi.post(POST?.DOWNLOAD_AND_UPLOAD_S3_FILES, obj)
            .then((data) => {
                if (data?.success) {
                    successMessage('Your file(s) Uploaded Successfully.')
                    handleCancel()
                }
                else {
                    errorMessage(data?.message)
                }
            })
            .catch(err => {
                let errMsg = err?.response?.data?.message || err?.message
                errorMessage(errMsg)
            })
            .finally(() => setLoading(false))
    }

    const createAndUploadFiles = () => {
        setLoading(true)
        let allSelectedFiles = files?.filter((v) => selectedFiles[v?.id])

        if (templateData?.isNew) {
            let objData = {
                processorId: templateData?.id,
                processorName: templateData?.displayName,
                submissionName,
                threshold
            }
            secureApi.post(POST.CREATE_SUBMISSION, objData)
                .then((data) => {
                    if (data?.success) {
                        let obj = {
                            files: allSelectedFiles,
                            submission_id: data?.id,
                            processorId: data?.processorId,
                            processorName: data?.processorName
                        }
                        uploadFiles(obj)
                    }
                    else {
                        errorMessage()
                    }
                })
                .catch((err) => {
                    errorMessage(err?.response?.data?.message)
                })
                .finally(() => setLoading(false))
        }
        else {
            let obj = {
                files: allSelectedFiles,
                submission_id: templateData?.id,
                processorId: templateData?.processor_id,
                processorName: templateData?.processor_name,
            }
            uploadFiles(obj)
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        // setFormData((prevData) => ({
        //     ...prevData,
        //     [name]: value
        // }))
    }

    return (
        <div style={{ minHeight: 400 }}>
            <div className='back-arrow2' onClick={goBack}>
                <ArrowBackIcon />
            </div>
            <div className='modalname'>
                <h5>Amazon S3 File Picker</h5>
            </div>
            <Grid container spacing={2} justifyContent={'flex-end'}>
                {files?.length ? <Grid item xs={12}>
                    <List
                        pagination={{ position: 'bottom', align: 'end', hideOnSinglePage: true }}
                        dataSource={files}
                        bordered
                        renderItem={item => (
                            <List.Item>
                                <Checkbox onClick={(e) => setSelectedFiles({ ...selectedFiles, [item?.id]: e?.target?.checked })}>
                                    <a href='javascript:void(0)'>{convertTitle(item?.name)}</a>
                                </Checkbox>
                            </List.Item>
                        )}
                    />
                    <div className='btn-end-div'>
                        <Button className='process-btn' style={buttonStyle} type='primary' loading={loading} onClick={createAndUploadFiles}>Upload</Button>
                    </div>
                </Grid> : <Grid item xs={12}>
                    <div className='s3-form'>
                        <p>Please enter AWS credentials with read/write permission to S3.</p>
                        <Grid container spacing={2}>
                            <Grid item sm={6} xs={12}>
                                <Input className='login-inp-field ant-radius' name='accessKey' placeholder='AWS Access Key' onChange={(e) => handleCancel(e?.target?.value)} />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Input className='login-inp-field ant-radius' name='secretKey' placeholder='AWS Secret Key' onChange={(e) => handleCancel(e?.target?.value)} />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Input className='login-inp-field ant-radius' name='bucketName' placeholder='S3 Bucket Name' onChange={(e) => handleCancel(e?.target?.value)} />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder='Your AWS Region'
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                >
                                    {awsRegions.map((region => <Option value={region}>{region}</Option>))}
                                </Select>
                            </Grid>
                            <Grid xs={12} style={{ marginLeft: 16 }}>
                                <Button className='process-btn' block type='primary' loading={loading} onClick={getBucketData}>Submit</Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>}
            </Grid>
        </div>
    )
}

S3Upload.propTypes = {
    goBack: PropTypes.func.isRequired,
    templateData: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    submissionName: PropTypes.string
}

export default S3Upload