import React from 'react'
import { Select, Modal, Progress, Space, Button } from 'antd'
import { useSelector } from 'react-redux'

const { Option } = Select

const CreateSubmission = (props) => {
    const { closeModal } = props
    const allProcessors = useSelector((state) => state?.docReducer?.allProcessors || [])

    const handleCancel = (e) => {
        closeModal(false)
    }

    return (
        <div className='template-screen'>
            <Modal
                open={true}
                // onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                // size='small'
                width={650}
            >
                <div className='select-process'>
                    <div className='modalname'>
                        <h5>Select Processor</h5>
                    </div>
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
                                        <div className='create-sub'>
                                            Create Submission
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
                                    placeholder='Filter'
                                    optionFilterProp='children'
                                    filterOption={(input, option) => option.children.includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                >
                                    {allProcessors?.map((v, i) => <Option key={i} value={v?.id}>{v?.displayName}</Option>)}
                                </Select>
                            </div>
                            <Button className='process-btn' type='primary'>Proceed</Button>
                        </div>
                    </div>
                </div>


                {/* ====================upload modal Start===================== */}
                {/* <div className='select-process'>
                    <div className='modalname'>
                        <h5>Sources</h5>
                    </div>
                    <div className='process-tiles'>
                        <div className='row'>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={LOCALDRIVE} alt="" />
                                    <span>Local Drive</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={AMAZON} alt="" />
                                    <span>Amazon</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={DRIVE} alt="" />
                                    <span>Drive</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={LOCALDRIVE} alt="" />
                                    <span>Local Drive</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={AMAZON} alt="" />
                                    <span>Amazon</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <div className='process-tiles-main'>
                                    <img src={DRIVE} alt="" />
                                    <span>Drive</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div> */}
                {/* ====================upload modal End===================== */}


                {/* ====================Progress modal End===================== */}

                {/* <div className='progress-modal'>

                    <div className='progress-modal-head'>
                        <h5>Uploading 7 Items </h5>
                    </div>
                    <div className='progress-bar-section'>
                        <div className='single-bar-div'>
                            <p>ABC Enterprise.pdf</p>
                            <div className='progress-bar-line'>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Progress className='progress-thickness' percent={50} size={[300, 20]} />
                                </Space>
                            </div>
                        </div>
                       
                        <div className='single-bar-div'>
                            <p>ABC Enterprise.pdf</p>
                            <div className='progress-bar-line'>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Progress className='progress-thickness' percent={50} size={[300, 20]} />
                                </Space>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='btn-can-proces'>
                            <Button style={{ background: '#F5F5F5' , width: '150px',margin:'0px 10px'}} className=''
                            >Cancel</Button>
                            <Button style={{ background: '#4285F4', color: '#fff', width: '150px',margin:'0px 10px' }} className=''
                            >Process</Button>
                        </div>
                    </div>
                </div> */}
                {/* ====================Progress modal End===================== */}
            </Modal>
        </div>
    )
}

export default CreateSubmission