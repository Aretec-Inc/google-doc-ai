import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import Button from 'antd/lib/button'
import Progress from 'antd/lib/progress'
import Tooltip from 'antd/lib/tooltip'
import Spin from 'antd/lib/spin'
import Input from 'antd/lib/input'
import Pagination from 'antd/lib/pagination'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import { CiMenuKebab } from 'react-icons/ci'
import { BsSearch } from 'react-icons/bs'
import moment from 'moment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import SubmissionModal from '../../Components/Submission/SubmissionModal'
import SubmissionTemplate from './SubmissionTemplate'
import { validateLength, convertTitle, disabledDate, itemRender } from '../../utils/helpers'
import { getAllSubmissions } from '../../Redux/actions/docActions'

const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'

const Submission = (props) => {
    const { dispatch } = props
    const allSubmissions = useSelector((state) => state?.docReducer?.allSubmissions || [])
    const totalSubmissions = useSelector((state) => state?.docReducer?.totalSubmissions || 0)
    const allProcessors = useSelector((state) => state?.docReducer?.allProcessors || [])
    const [open, setOpen] = useState(false)
    const [showTemplate, setShowTemplate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [templateData, setTemplateData] = useState({})
    const [submissionName, setSubmissionName] = useState('')
    const [processorId, setProcessorId] = useState('')
    const [dateRange, setDateRange] = useState(null)
    const [pageSize, setPageSize] = useState(10)
    const [pageNo, setPageNo] = useState(1)

    useEffect(() => {
        if (!allSubmissions?.length) {
            setLoading(true)
        }
        dispatch(getAllSubmissions({ submissionName, processorId, dateRange, pageNo, pageSize }, setLoading))
    }, [open, submissionName, processorId, dateRange, pageNo, pageSize])

    const showModal = () => {
        setOpen(true)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const setRange = (d) => {
        if (!d) {
            return setDateRange(null)
        }
        setDateRange({
            start: d[0].format('YYYY-MM-DD'),
            end: moment(d[1]).add(1, 'day').format('YYYY-MM-DD')
        })
    }

    if (showTemplate && templateData?.id) {
        return <SubmissionTemplate {...props} goBack={() => setShowTemplate(false)} templateData={templateData} />
    }

    return (
        <div className='template-screen'>
            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                    <Select
                        className='subdropdes ant-radius'
                        showSearch
                        placeholder='Filter'
                        optionFilterProp='children'
                        filterOption={(input, option) => option?.children?.includes(input)}
                        filterSort={(optionA, optionB) =>
                            optionA?.children?.toLowerCase()?.localeCompare(optionB?.children?.toLowerCase())
                        }
                        onChange={(e) => setProcessorId(e)}
                    >
                        {allProcessors?.map((v, i) => <Option key={i} value={v?.id}>{v?.displayName}</Option>)}
                    </Select>
                </Grid>
                <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
                    <RangePicker
                        format={dateFormat}
                        style={{ width: '100%' }}
                        className='ant-radius'
                        disabledDate={disabledDate}
                        onChange={setRange}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={7} xs={12}>
                    <Input
                        className='ant-radius'
                        placeholder='Search by Submission name'
                        prefix={<BsSearch className='search-field-icon' />}
                        onChange={(e) => setSubmissionName(e?.target?.value)}
                    />
                </Grid>
                <Grid item xl={4} lg={3} md={12} sm={5} xs={12} style={{ textAlign: 'right' }}>
                    <Button style={{ background: '#4285F4', color: '#fff', width: '180px' }} onClick={showModal} className='date width-sub height_57px ant-radius'
                    >Create Submission</Button>
                </Grid>
            </Grid>

            <div className='submission-div'>
                <div className='submission-card'>
                    <div className='submission-card-div'>
                        <div className='submission-main-list'>
                            <div className='submission-heading'>
                                <p className='submission-title mg_lf_15px'>{totalSubmissions} Submissions</p>
                                <div className='processor-data'>
                                    <CiMenuKebab className='menuicon' />
                                </div>
                            </div>
                            <div className='submission-table-main'>
                                <Spin spinning={loading}>
                                    <TableContainer component={Paper} className='submission-table'>
                                        <Table
                                            size='small' aria-label='a dense table'
                                        >
                                            <TableHead>
                                                <TableRow className='submission-head'>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Submission</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Processor</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Total Forms</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Average Confidence</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Status</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Created Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {allSubmissions?.map((v, i) => {
                                                    return (
                                                        <TableRow
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            key={i}
                                                        >
                                                            <TableCell className='submission-table-first-col pointer submission-row-cell' component='th' scope='row'>
                                                                <Link onClick={() => (setShowTemplate(true), setTemplateData(v))}>
                                                                    <Tooltip placement='top' title={convertTitle(v?.submission_name)}>
                                                                        {validateLength(convertTitle(v?.submission_name), 16)}
                                                                    </Tooltip>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>{v?.processor_name}</TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>{v?.total_forms}</TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>
                                                                <Progress
                                                                    percent={v?.average_confidence}
                                                                />
                                                            </TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>{v?.status}</TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>{moment(v?.created_at)?.format('MMM D, YYYY, h:mm:ss A')}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Spin>
                            </div>
                            <div className='submissions-foote'>
                                <Pagination
                                    total={totalSubmissions}
                                    pageSize={pageSize}
                                    current={pageNo}
                                    itemRender={itemRender}
                                    showQuickJumper
                                    hideOnSinglePage
                                    onShowSizeChange={(e) => setPageSize(e * 10)}
                                    onChange={setPageNo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {open ? <SubmissionModal closeModal={handleCancel} {...props} /> : null}
        </div>
    )
}

export default Submission