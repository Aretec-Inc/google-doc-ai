import { Select, Modal } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

const CreateSubmission = (props) => {
    const { closeModal } = props

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
                width={1000}
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
                                <div className='col-lg-3'>
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
                                    // onChange={onChangeTrans}
                                    // onSearch={onSearch}
                                    placeholder='Filter'
                                    optionFilterProp='children'
                                    filterOption={(input, option) => option.children.includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                >
                                    <Option value='Not Identified'>Not Identified</Option>
                                    <Option value='Closed'>Closed</Option>
                                    <Option value='Communicated'>Communicated</Option>
                                </Select>
                            </div>
                            <button className='process-btn'>Proceed</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CreateSubmission