import React, { useState, useRef } from 'react'
import { Button, Tooltip, List, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { PlusOutlined } from '@ant-design/icons'
import Grid from '@mui/material/Grid'
import { secureApi } from '../../Config/api'
import { POST } from '../../utils/apis'
import { errorMessage, warningMessage, successMessage, validateLength, convertTitle, itemRender } from '../../utils/helpers'

const buttonStyle = { width: 140 }

const GCSUpload = (props) => {
    const { goBack, templateData, handleCancel, threshold, submissionName } = props
    const [loading, setLoading] = useState(false)
    const [serviceKey, setServiceKey] = useState(null)
    const [buckets, setBuckets] = useState([])
    const [bucket, setBucket] = useState(null)
    const [filePath, setFilePath] = useState(null)
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState({})
    const draggerRef = useRef(null)

    const normServiceKey = (e) => {
        let type = 'application/json'
        let file = e?.target?.files?.[0]

        if (!file || file?.type !== type) {
            return warningMessage('Please Upload a Valid File!')
        }

        setServiceKey(file)
    }

    const validateServiceKey = () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', serviceKey)
        secureApi.post(POST?.VALIDATE_SERVICE_KEY_GCS, formData)
            .then((data) => {
                if (data?.success) {
                    setBuckets(data?.buckets || [])
                    setFilePath(data?.filePath || null)
                }
                else {
                    errorMessage(data?.message)
                }
            })
            .catch(error => {
                errorMessage()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getBucketData = (bucket) => {
        setBucket(bucket)
        let obj = {
            bucket,
            filePath
        }

        secureApi.post(POST?.GET_BUCKET_DATA, obj)
            .then((data) => {
                setFiles(data?.files)
            })
            .catch(error => {
                console.log('ERROR', error)
            })
    }

    const uploadFiles = (obj) => {
        secureApi.post(POST?.DOWNLOAD_AND_UPLOAD_FILES, obj)
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
                            bucket,
                            filePath,
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
                bucket,
                filePath,
                files: allSelectedFiles,
                submission_id: templateData?.id,
                processorId: templateData?.processor_id,
                processorName: templateData?.processor_name,
            }
            uploadFiles(obj)
        }
    }

    return (
        <div style={{ minHeight: 400 }}>
            <div className='back-arrow2' onClick={goBack}>
                <ArrowBackIcon />
            </div>
            <div className='modalname'>
                <h5>Google Cloud Storage (GCS)</h5>
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
                                    <a href='javascript:void(0)'>{item?.name}</a>
                                </Checkbox>
                            </List.Item>
                        )}
                    />
                    <div className='btn-end-div'>
                        <Button className='process-btn' style={buttonStyle} type='primary' loading={loading} onClick={createAndUploadFiles}>Upload</Button>
                    </div>
                </Grid> : !buckets?.length ? <Grid item xs={12}>
                    <div className='home-main-div' style={{ flex: 2, marginTop: 20, transition: 'all 500ms ease', height: 400 }}>

                        <div className='dragger-parent' onClick={() => draggerRef.current.click()}>
                            <div
                                className='home-card'
                            >
                                <div className='dragger-container'>
                                    <p className='ant-upload-drag-icon'>
                                        <PlusOutlined className='upload-icon' />
                                    </p>
                                    <div className='div-center'>
                                        <p className='inside-box-heading'>Drag and Drop or Click to Upload Files Here</p>
                                        <p className='inside-box-text'>
                                            Drag and Drop the Files you want to upload here or click to select them from your hard drive.
                                        </p>
                                        <p className='file-types'>
                                            Files Type: JSON
                                        </p>
                                        <Button
                                            className='form-input upload-home-btn'
                                            type='primary'
                                        >
                                            Upload Or Drop Your Files Here
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input
                            type='file'
                            onChange={normServiceKey}
                            ref={draggerRef}
                            accept={'application/json'}
                            style={{ display: 'none' }}
                        />
                        {serviceKey?.name ? <div className='file-display-div'>
                            <Tooltip title={convertTitle(serviceKey?.name)}>
                                <a>
                                    {validateLength(convertTitle(serviceKey?.name), 30)}
                                </a>
                            </Tooltip>
                            <Button className='process-btn3' type='primary' style={buttonStyle} disabled={!serviceKey?.name} loading={loading} onClick={validateServiceKey}>Validate Key</Button>
                        </div> : null}
                    </div>
                </Grid> : <Grid item xs={12}>
                    <div className='modalname'>
                        <p>Select GCS Bucket</p>
                    </div>
                    <List
                        pagination={{ position: 'bottom', align: 'end', hideOnSinglePage: true }}
                        dataSource={buckets}
                        bordered
                        renderItem={item => (
                            <List.Item>
                                <a href='javascript:void(0)' onClick={() => getBucketData(item)}>{item}</a>
                            </List.Item>
                        )}
                    />
                </Grid>}
            </Grid>
        </div>
    )
}

GCSUpload.propTypes = {
    goBack: PropTypes.func.isRequired,
    templateData: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    submissionName: PropTypes.string
}

export default GCSUpload