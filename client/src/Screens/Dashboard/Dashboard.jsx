import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, Tabs, Select, DatePicker } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'
const Dashboard = (props) => {

    return (
        <div className='main_container'>
            <div className='dashboard-section'>
                <div className='row'>
                    <div className='col-lg-4 col-md-4 col-sm-12 pading-media'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Documents</h1>
                                <p>28</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-12 pading-media'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Documents</h1>
                                <p>28</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-12 pading-media'>
                        <div className='dash-top-card'>
                            Chart Here
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-12 p-0'>
                        <div className='dashboard-heading'>
                            <p className='submission-title mg_lf_15px'>Automation</p>
                            <Button style={{ background: '#4285F4', color: '#fff' }} className='date width-sub height_57px'
                            >Download CSV</Button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-2 col-md-3 col-sm-3'>
                        <Select
                            className='width subdropdes'
                            showSearch
                            placeholder='Filter'
                            optionFilterProp='children'
                            filterOption={(input, option) => option?.children?.includes(input)}
                            filterSort={(optionA, optionB) =>
                                optionA?.children?.toLowerCase()?.localeCompare(optionB?.children?.toLowerCase())
                            }
                        >
                            <Option value='Communicated'>Communicated</Option>
                        </Select>
                    </div>
                    <div className='col-lg-1 dis-none'></div>
                    <div className='col-lg-2 col-md-3 col-sm-3'>
                        <Select
                            className='width subdropdes'
                            showSearch
                            placeholder='Filter'
                            optionFilterProp='children'
                            filterOption={(input, option) => option?.children?.includes(input)}
                            filterSort={(optionA, optionB) =>
                                optionA?.children?.toLowerCase()?.localeCompare(optionB?.children?.toLowerCase())
                            }
                        >
                            <Option value='Communicated'>Communicated</Option>
                        </Select>
                    </div>
                    <div className='col-lg-1 dis-none'></div>
                    <div className='col-lg-3 col-md-4 col-sm-6'>
                        <RangePicker
                            // onChange={onChangeDate}
                            className='date width'
                            defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                            format={dateFormat}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard