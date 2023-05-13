import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Tabs, Select, DatePicker, Divider } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import ReactApexChart from 'react-apexcharts';
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DASHBOARD_ICON from '../../assets/icons/secondary_head_icons/dashblack.svg'
import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { errorMessage } from '../../utils/helpers'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SubmissionVisuals from './SubmissionVisuals';
import ProcessorVisuals from './ProcessorVisuals';
import LineChart from './LineChart';

const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'

const useStyles = makeStyles({
    tableHead: {
        backgroundColor: '#f5f5f5',
    },
});

const Dashboard = (props) => {
    const classes = useStyles();
    const [documents, setDocuments] = useState('')
    const [submissions, setSubmissions] = useState('')

    useEffect(() => {
        getDashboardData()
    }, [])


    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Submission-1', 159, 6.0, 24, 4.0),
        createData('Submission-2', 237, 9.0, 37, 4.3),
        createData('Submission-3', 262, 16.0, 24, 6.0),
        createData('Submission-4', 305, 3.7, 67, 4.3),
        createData('Submission-5', 356, 16.0, 49, 3.9),
    ]

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

    const data1 = {
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

    const getDashboardData = () => {
        // if (!documents?.length) {
        //     setLoading(true)
        // }

        secureApi.get(`${GET.DASHBOARD_DATA}`)
            .then((data) => {
                const { documents, submissions } = data
                // console.log("DATA ==>", documents, submissions)
                setDocuments(documents)
                setSubmissions(submissions)
                // dispatch(setDocuments({ [submission_id]: data?.documents || [] }))
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message
                errorMessage(errMsg)
            })
            .finally(() => {
                // setLoading(false)
            })
    }

    const pie = {
        series: [documents, submissions],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: ['Documents', 'Submissions'],
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
            }]
        },

    }

    const data = [
        { type: 'A', value: 27 },
        { type: 'B', value: 25 },
        { type: 'C', value: 18 },
        { type: 'D', value: 15 },
        { type: 'E', value: 10 },
        { type: 'F', value: 5 },
    ];

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        autoFit: true,
        // width: '100%',
        // height: '100%',
        label: {
            type: 'outer',
            content: '{percentage}',
        },
    };


    return (
        <div className='main_container-dashboard'>
            <div className='secondary_header_container'>
                <div className='left_sec_head'>
                    <div className='secondary_header_left'>
                        <img width={'30px'} src={DASHBOARD_ICON} alt='DASHBOARD_ICON' />
                        <h2 className='secondary_header_heading'>
                            Dashboard
                        </h2>
                    </div>
                    <h2 className='secondary_header_heading'>
                        Services
                    </h2>
                </div>
                <div className='right_sec_head'>
                    <Button type='text' className='secondary_header_buttons'>
                        <span className="material-symbols-outlined mg_rgt_3px">
                            chat
                        </span>
                        <span>
                            Help Assistant
                        </span>
                    </Button>
                    <Button type='text' className='secondary_header_buttons'>
                        <span className="material-symbols-outlined mg_rgt_3px">
                            school
                        </span>
                        <span>
                            Learn
                        </span>
                    </Button>
                </div>
            </div>
            <Divider />
            <br />
            <div className='dashboard-section'>
                <div className='row'>
                    <div className='col-lg-4'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Documents</h1>
                                <p>{documents}</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='dash-top-card'>
                            <div className='dash-top-card-main'>
                                <h1>Total Submissions</h1>
                                <p>{submissions}</p>
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
                                    <Chart options={data1.options} series={data1.series} type="bar" height={120} />
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
                    {/* <div className='btm_chart'>
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="area"
                            height={250}
                        />
                    </div> */}
                    {/* <div class="grid-charts-cont">
                        <div class="column-chart">
                            <ReactApexChart options={pie.options} series={pie.series} type="pie" width={380} />
                        </div>
                        <div className="column-chart">
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead className={classes.tableHead}>
                                        <TableRow>
                                            <TableCell>Submissions</TableCell>
                                            <TableCell align="right">Total Documents</TableCell>
                                            <TableCell align="right">Confidence Score</TableCell>
                                            <TableCell align="right">Average Score</TableCell>
                                            <TableCell align="right">Threshold</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.calories}</TableCell>
                                                <TableCell align="right">{row.fat}</TableCell>
                                                <TableCell align="right">{row.carbs}</TableCell>
                                                <TableCell align="right">{row.protein}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div> */}
                    <div className="container-dash">
                        <div className="box-dash">
                            <SubmissionVisuals />
                        </div>
                        <div className="box-dash">
                            <ProcessorVisuals />
                        </div>
                        <div className="box-dash">
                            <LineChart />
                        </div>
                    </div>
                    <div>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell>Submissions</TableCell>
                                        <TableCell align="right">Total Documents</TableCell>
                                        {/* <TableCell align="right">Confidence Score</TableCell> */}
                                        <TableCell align="right">Average Score</TableCell>
                                        <TableCell align="right">Threshold</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.calories}</TableCell>
                                            {/* <TableCell align="right">{row.fat}</TableCell> */}
                                            <TableCell align="right">{row.carbs}</TableCell>
                                            <TableCell align="right">{row.protein}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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