import React, { useState, useRef } from 'react'
import { Select, Modal, Progress, Space, Button, Tooltip, Spin } from 'antd'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { secureApi } from '../../Config/api'
import { POST } from '../../utils/apis'
import { errorMessage, warningMessage, validateLength, convertTitle, successMessage } from '../../utils/helpers'
import { useSelector } from 'react-redux'
import LOCALDRIVE from '../../assets/localdrive.svg'
import DRIVE from '../../assets/drive.svg'
import AMAZON from '../../assets/S3.svg'
import ONE_DRIVE from '../../assets/onedrive.svg'
import GCP from '../../assets/gcp.svg'

const { Option } = Select

const steps = ['Processor', 'Sources']

const CreateSubmission = (props) => {
    const { closeModal } = props
    const allProcessors = useSelector((state) => state?.docReducer?.allProcessors || [])
    const [processor, setProcessor] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [selectedModel, setSelectedModel] = useState(null)
    const [showFilesModal, setShowFilesModal] = useState(false)
    const [fileList, setFileList] = useState([])
    const [completed, setCompleted] = useState({})
    const draggerRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [uploadloading, setUploadLoading] = useState(false)
    const [buttonText, setButtonText] = useState('Upload')
    const defaultParser = {
        displayName: 'Form Parser',
        id: 'aebf936ce61ab3b1'
    }

    const handleCancel = (e) => {
        draggerRef.current.value = ''
        setShowFilesModal(false)
        closeModal()
    }

    const totalSteps = () => {
        return steps.length
    }

    const completedSteps = () => {
        return Object.keys(completed).length
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps()
    }

    const handleNext = (isDefault = false) => {

        if (!processor && !isDefault) {
            return errorMessage('Please Select Model!')
        }
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStep = (step) => () => {
        if (!processor) {
            return errorMessage('Please Select Model!')
        }

        setActiveStep(step)
    }

    const setDefaultProcessor = async () => {
        setProcessor(defaultParser)
        handleNext(true)
    }

    const createSubmission = () => {
        if (!processor) {
            return errorMessage('Please Select Model!')
        }

        let obj = {
            processorId: processor?.id,
            processorName: processor?.displayName
        }

        setLoading(true)
        secureApi.post(POST.CREATE_SUBMISSION, obj)
            .then((data) => {
                if (data?.success) {
                    closeModal()
                    return successMessage(data?.message)
                }
            })
            .catch((err) => {
                errorMessage(err?.response?.data?.message)
            })
            .finally(() => {
                setLoading(false)
            })
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
        const origin = 'http://localhost:3000'
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
                        const { sessionUrl, fileId, fileUrl, fileType } = data
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

                        let headers = { 'Content-Type': contentType, 'Content-Length': fileData.size, 'Origin': origin }

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
                    let obj = {
                        processorId: processor?.id,
                        processorName: processor?.displayName
                    }
                    secureApi.post(POST.CREATE_SUBMISSION, obj)
                        .then((data) => {
                            if (data?.success) {
                                let newObj = {
                                    template_id: data?.template_id,
                                    processorId: data?.processor_id,
                                    files: fileList
                                }

                                secureApi.post(POST?.UPLOAD_DOCUMENTS, newObj)
                                    .then((data) => {
                                        setLoading(false)
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
                        })
                        .catch((err) => {
                            errorMessage(err?.response?.data?.message)
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
                <Spin spinning={loading}>
                    <div className='stepper-head'>
                        <Stepper nonLinear activeStep={activeStep} hidden={showFilesModal}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completed[index]}>
                                    <StepButton color='inherit' onClick={handleStep(index)}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                    {activeStep === 0 ? <div className='select-process'>
                        <div className='modal-content-sec'>
                            <div className='modal-content-data'>
                                <h6>General</h6>
                                <p>Ready to use out-of-the-box processors for general document goals.</p>
                            </div>
                            <div className='modal-tiles'>
                                <div className='row'>
                                    <div className='col-lg-4 col-md-5 col-sm-10 col-xs-12'>
                                        <div className='modal-tiles-main'>
                                            <h5>Form Parser</h5>
                                            <p>Extract form elements such as text and checkboxes</p>
                                            <div className='create-sub' onClick={setDefaultProcessor}>
                                                Select Default Processor
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content-data'>
                                <h6>Model</h6>
                                <p>Schematized processors for domain-specific documents.</p>
                                <div className='specialize-dropdown'>
                                    <Select
                                        className='width subdropdes'
                                        showSearch
                                        placeholder='Select Model'
                                        optionFilterProp='children'
                                        value={selectedModel}
                                        onSelect={(i) => (setProcessor(allProcessors[i]), setSelectedModel(i))}
                                        filterOption={(input, option) => option.children.includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                    >
                                        {allProcessors?.map((v, i) => <Option key={i} value={i}>{v?.displayName}</Option>)}
                                    </Select>
                                </div>
                                <div className='btn-end-div'>
                                    <Button className='process-btn' type='primary' disabled={!Boolean(processor)} onClick={handleNext}>Next</Button>
                                </div>
                            </div>
                        </div>
                    </div> : !showFilesModal && !fileList?.length ? <div className='select-process'>
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
                                    <div className='process-tiles-main'>
                                        <img src={GCP} alt="" className='upload-image' />
                                        <span>Google Cloud Storage</span>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className='btn-end-div'>
                            <Button className='process-btn process-btn2' type='default' disabled={loading} onClick={handleBack}>Back</Button>
                            <Button className='process-btn process-btn2' type='primary' loading={loading} onClick={createSubmission}>Skip & Create Submission</Button>
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
                                            <Tooltip placement='top' title={convertTitle(v?.name)} color={'#1890ff'}>
                                                {validateLength(convertTitle(v?.name), 16)}
                                            </Tooltip>
                                        </div>
                                        <div className='progress-bar-line'>
                                            <Space direction='vertical' style={{ width: '100%' }}>
                                                <Progress className='progress-thickness' percent={v?.progress} size={[300, 20]} strokeColor={{ '0%': '#4285F4', '100%': '#87d068' }} />
                                            </Space>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='btn-end-div'>
                            <Button className='process-btn process-btn2' style={{ width: 140 }} disabled={uploadloading} onClick={() => (setShowFilesModal(false, setFileList([])))}>Back</Button>
                            <Button className='process-btn' style={{ width: 140 }} type='primary' loading={uploadloading} onClick={onFinish}>{buttonText}</Button>
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
                </Spin>
            </Modal>
        </div>
    )
}

export default CreateSubmission