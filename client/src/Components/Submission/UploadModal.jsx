import React, { useState, useRef } from 'react'
import { Modal, Progress, Space, Button, Tooltip } from 'antd'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { secureApi } from '../../Config/api'
import { POST } from '../../utils/apis'
import { errorMessage, warningMessage, validateLength, convertTitle, successMessage } from '../../utils/helpers'
import GCSUpload from './GCSUpload'
import LOCALDRIVE from '../../assets/localdrive.svg'
import DRIVE from '../../assets/drive.svg'
import AMAZON from '../../assets/S3.svg'
import ONE_DRIVE from '../../assets/onedrive.svg'
import GCP from '../../assets/gcp.svg'

const buttonStyle = { width: 140 }

const CreateSubmission = (props) => {
    const { closeModal, templateData } = props
    const [showFilesModal, setShowFilesModal] = useState(false)
    const [fileList, setFileList] = useState([])
    const draggerRef = useRef(null)
    const [uploadloading, setUploadLoading] = useState(false)
    const [showGCS, setShowGCS] = useState(false)
    const [buttonText, setButtonText] = useState('Upload')

    const handleCancel = (e) => {
        draggerRef.current.value = ''
        setShowFilesModal(false)
        closeModal()
    }

    const normFile = (e, isDelete = false) => {
        let arr = []
        let isValid = true
        let types = ['application/pdf']
        let files = e?.target?.files

        for (var v of files) {
            if (types.indexOf(v?.type) !== -1) {
                arr.push(v)
            }
            else {
                if (!isDelete)
                    warningMessage('Please Upload Valid Files!')
            }
        }

        setFileList(arr)
        arr?.length && setShowFilesModal(true)
        !isValid && warningMessage('Please Upload Valid Files!')
    }

    const onFinish = async () => {
        setUploadLoading(true)
        setButtonText('Uploading...')
        let allFilesData = []
        const pendingPromises = []

        for (let [i, v] of fileList?.entries()) {
            pendingPromises.push(new Promise(async (resolve, reject) => {
                let arr = [...fileList]

                let fileData = v.originFileObj ? v.originFileObj : v
                let contentType = fileData.type || 'application/octet-stream'
                let file = {}
                file.originalname = fileData.name
                file.mimetype = fileData.type
                // need to change later
                file.path = fileData.name
                file.size = fileData.size

                try {
                    const data = await secureApi.post(`${POST?.GET_UPLOAD_URL}?fileOriginalName=${fileData.name}&contentType=${contentType}`)
                    if (data?.success) {
                        const { sessionUrl, fileId, fileUrl, fileType, Origin } = data
                        file.fileId = fileId
                        file.fileUrl = fileUrl
                        file.fileType = fileType
                        file.originalFileUrl = data?.originalFileUrl || fileUrl
                        arr[i].fileSize = arr[i]?.size
                        arr[i].fileName = `${fileId}-${fileData.name}`
                        arr[i].fileOriginalName = fileData.name
                        arr[i].sessionUrl = sessionUrl
                        arr[i].fileId = fileId
                        arr[i].fileUrl = fileUrl
                        arr[i].fileType = fileType
                        arr[i].originalFileUrl = data?.originalFileUrl || fileUrl

                        let headers = { 'Content-Type': contentType, 'Content-Length': fileData.size, 'Origin': Origin }

                        axios.put(sessionUrl, fileData, {
                            headers: headers,
                            onUploadProgress: (progressEvent) => {
                                const fileProgress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                                arr[i].progress = fileProgress
                                arr[i].uploaded = progressEvent.loaded
                                setFileList([...arr])
                            }
                        })
                            .then((resp) => {
                                if (resp.status === 200) {
                                    allFilesData.push(file)
                                    resolve(allFilesData)
                                }
                                else {
                                    resolve(allFilesData)
                                }
                            })
                            .catch(error => {
                                console.log('error***************', error)
                            })
                    }
                    else {
                        console.log(data?.message || 'Something Went wrong while fetching signed url')
                        reject(data?.message || 'Something Went wrong while fetching signed url')
                    }
                }
                catch (err) {
                    console.error("ERROR DURING UPLOAD", err)
                }
            }))
        }

        Promise.all(pendingPromises)
            .then(async () => {
                if (allFilesData?.length) {
                    let newObj = {
                        submission_id: templateData?.id,
                        processorId: templateData?.processor_id,
                        processorName: templateData?.processor_name,
                        files: fileList
                    }

                    secureApi.post(POST?.UPLOAD_DOCUMENTS, newObj)
                        .then((data) => {
                            if (data?.success) {
                                successMessage('Your file(s) Uploaded Successfully.')
                                setFileList([])
                                closeModal()
                            }
                            else {
                                errorMessage(data?.message)
                            }
                        })
                        .catch(error => {
                            console.log('ERROR', error)
                        })
                        .finally(() => {
                            setUploadLoading(false)
                            setButtonText('Upload')
                        })
                }
                else {
                    setUploadLoading(false)
                    setButtonText('Upload')
                    errorMessage()
                }
            })
            .catch(e => {
                setUploadLoading(false)
                setButtonText('Upload')
                console.log('error all promises ', e)
                errorMessage()
            })
    }

    return (
        <div className='template-screen'>
            <Modal
                open={true}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                {showGCS ? <GCSUpload templateData={templateData} goBack={() => setShowGCS(false)} handleCancel={handleCancel} /> : !showFilesModal && !fileList?.length ? <div className='select-process'>
                    <div className='modalname'>
                        <h5>Select Source to Upload Files</h5>
                    </div>
                    <div className='process-tiles'>
                        <Grid container justifyContent={'space-between'}>
                            <Grid item>
                                <div className='process-tiles-main' onClick={() => draggerRef.current.click()}>
                                    <img src={LOCALDRIVE} alt="" className='upload-image' />
                                    <span>Local Drive</span>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className='process-tiles-main'>
                                    <img src={AMAZON} alt="" className='upload-image' />
                                    <span>Amazon</span>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className='process-tiles-main'>
                                    <img src={DRIVE} alt="" className='upload-image' />
                                    <span>Drive</span>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className='process-tiles-main'>
                                    <img src={ONE_DRIVE} alt="" className='upload-image' />
                                    <span>OneDrive</span>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className='process-tiles-main' onClick={() => setShowGCS(true)}>
                                    <img src={GCP} alt="" className='upload-image' />
                                    <span>Google Cloud Storage</span>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div> : <div className='progress-modal'>
                    <div className='progress-modal-head'>
                        <h5>Uploading {fileList?.length} {`item${fileList?.length === 1 ? '' : 's'}`}</h5>
                    </div>
                    <div className='progress-bar-section'>
                        {fileList?.map((v, i) => {
                            return (
                                <div className='single-bar-div' key={i}>
                                    <div className='upload-file-name'>
                                        <Tooltip placement='top' title={convertTitle(v?.name)}>
                                            {validateLength(convertTitle(v?.name), 16)}
                                        </Tooltip>
                                    </div>
                                    <div className='progress-bar-line'>
                                        <Space direction='vertical' style={{ width: '100%' }}>
                                            <Progress className='progress-thickness' percent={v?.progress} size={[300, 20]} />
                                        </Space>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='btn-end-div'>
                        <Button className='process-btn process-btn2' style={buttonStyle} disabled={uploadloading} onClick={() => (setShowFilesModal(false, setFileList([])))}>Back</Button>
                        <Button className='process-btn' style={buttonStyle} type='primary' loading={uploadloading} onClick={onFinish}>{buttonText}</Button>
                    </div>
                </div>}
                <input
                    type='file'
                    onChange={normFile}
                    ref={draggerRef}
                    multiple='multiple'
                    accept={'application/pdf'}
                    style={{ display: 'none' }}
                />
            </Modal>
        </div>
    )
}

export default CreateSubmission