import React, { useState, useEffect } from 'react'
import { Modal, Select, Button, Form, Input } from 'antd'
import { convertTitle, successMessage, errorMessage } from '../../utils/pdfHelpers'
import { secureApi } from '../../Config/api'
import { BIG_QUERY_APIS } from '../../utils/apis'

const { POST: { BQ_CREATE_MODEL } } = BIG_QUERY_APIS;

const accept = ['INT64', 'NUMERIC', 'BIGNUMERIC', 'FLOAT64']

const { Option } = Select

const BigQModal = (props) => {
    const [labels, setLabels] = useState([])
    const [btnText, setBtnText] = useState('Create Model')
    const [loading, setLoading] = useState(false)
    const { onCancel, bigQColumns, selectedCard } = props

    useEffect(() => {
        setLabels(bigQColumns?.filter((v, i) => accept.indexOf(v.type?.toUpperCase()) !== -1))
    }, [props.bigQColumns])

    const onFinish = (val) => {
        val.id = selectedCard?.id
        setBtnText('Creating....')
        setLoading(true)
        secureApi.post(BQ_CREATE_MODEL, val)
            .then((data) => {
                setBtnText('Create Model')
                setLoading(false)
                if (data?.success) {
                    successMessage(data?.message)
                    return onCancel()
                } else {
                    let errMsg = data?.message;
                    errMsg && errorMessage(errMsg);
                }
            })
            .catch((err) => {
                setBtnText('Create Model')
                setLoading(false);
                let errMsg = err?.response?.data?.message || err?.message;
                errMsg && errorMessage(errMsg);
            })
    }

    return (
        <div>
            <Modal
                title='Train Model'
                visible
                onCancel={onCancel}
                footer={[
                    <Button
                        key='back'
                        onClick={onCancel}
                        className='form-input'
                    >
                        Return
                    </Button>
                ]}
            >
                <Form
                    name='basic'
                    onFinish={onFinish}
                    style={{ width: '100%' }}
                    hideRequiredMark
                >
                    <Form.Item
                        name='modelName'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input the model name!'
                            }
                        ]}
                    >
                        <Input
                            placeholder='Enter Model Name Here!'
                        />
                    </Form.Item>
                    <Form.Item
                        name='modelType'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please Select the Model'
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            showArrow
                            optionFilterProp='children'
                            placeholder='Select Model Type'
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value='linear_reg'>Liner Regression</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='columns'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please Select the columns'
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            showArrow
                            allowClear
                            optionFilterProp='children'
                            placeholder='Select Columns'
                            mode='multiple'
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {bigQColumns?.map((v, i) => <Option
                                value={v?.name}
                                key={i}
                            >
                                {convertTitle(v?.name)}
                            </Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='learningRate'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input the Learning Rate!'
                            }
                        ]}
                    >
                        <Input
                            placeholder='Enter Learning Rate Here'
                            type='number'
                        />
                    </Form.Item>
                    <Form.Item
                        name='regularization'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input the L1 Regularization!'
                            }
                        ]}
                    >
                        <Input
                            placeholder='Enter L1 Regularization Here!'
                            type='number'
                        />
                    </Form.Item>
                    <Form.Item
                        name='maxIteration'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input the Max Iteration!'
                            },
                            {
                                min: 1,
                                message: 'Minimum 1 Iteration Required!'
                            }
                        ]}
                    >
                        <Input
                            placeholder='Enter Max Iteration Here!'
                            type='number'
                        />
                    </Form.Item>
                    <Form.Item
                        name='labels'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please Select the labels'
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            showArrow
                            allowClear
                            mode='multiple'
                            optionFilterProp='children'
                            placeholder='Select Lables'
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {labels?.map((v, i) => <Option
                                value={v?.name}
                                key={i}
                            >
                                {convertTitle(v?.name)}
                            </Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='labels'
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please Select the labels'
                            }
                        ]}
                    >
                        <Button
                            htmlType='submit'
                            type='primary'
                            className='form-button'
                            block
                            loading={loading}
                        >
                            {btnText}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default BigQModal