import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, Tabs, Select, DatePicker } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import ReactApexChart from 'react-apexcharts';
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'
const Dashboard = (props) => {

    const chartData = {
        options: {
            chart: {
                id: 'area-chart',
                toolbar: {
                    show: false
                }
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            tooltip: {
                x: {
                    show: false
                }
            },
            fill: {
                opacity: 0.3
            }
        },
        series: [
            {
                name: 'Series A',
                data: [30, 40, 25, 50, 49, 21, 70, 51, 30, 40, 25, 50]
            },
            {
                name: 'Series B',
                data: [23, 12, 54, 61, 32, 56, 81, 19, 43, 32, 56, 81]
            }
        ]
    };

    const data = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5'],
                labels: {
                    show: false, // set to false to hide x-axis labels
                },
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            plotOptions: {
                bar: {
                    colors: {
                        ranges: [{
                            from: 91,
                            to: 93,
                            color: '#4285F4',
                        }, {
                            from: 93,
                            to: 95,
                            color: '#DB4437',
                        }, {
                            from: 98,
                            to: 99,
                            color: '#91CBA9',
                        }, {
                            from: 98,
                            to: 100,
                            color: '#fcbf33cc',
                        }],
                    },
                },
            }
        },
        series: [
            {
                name: "Sales",
                data: [98, 92, 99, 93, 98],
            }
        ],
        yaxis: {
            labels: {
                show: false, // set to false to hide y-axis labels
            },
        }
    }

    return (
        <div className='main_container'>
            <div className='dashboard-section'>
                <div className='row'>
                    <div className='col-lg-4'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Documents</h1>
                                <p>28</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Submissions</h1>
                                <p>28</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='dash-top-card'>
                            <div className='card-chart'>
                                <div className="left">
                                    <h2>95%</h2>
                                    <p>Average Submissions confidence score</p>
                                </div>
                                <div className="right">
                                    <Chart options={data.options} series={data.series} type="bar" height={120} />
                                </div>
                            </div>
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
                    <div className='col-lg-2'>
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
                    <div className='col-lg-1'></div>
                    <div className='col-lg-2'>
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
                    <div className='col-lg-1'></div>
                    <div className='col-lg-3'>
                        <RangePicker
                            // onChange={onChangeDate}
                            className='date width'
                            defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                            format={dateFormat}
                        />
                    </div>

                </div>
                <div>
                    <div className='btm_chart'>
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="area"
                            height={250}
                        />
                    </div>
                    <div className="grid-container-bottom">
                        <div className="grid-item-card">
                            Field Transcription Automation
                            <h2>98.9</h2>
                        </div>
                        <div className="grid-item-card">
                            Table Transcription Automation
                            <h2>100%</h2></div>
                        <div className="grid-item-card">
                            Machine Field Automation
                            <h2>2282</h2></div>
                        <div className="grid-item-card">
                            Machine Table Transcription
                            <h2>2262</h2></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard