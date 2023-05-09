import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Select, DatePicker, Input, Button, Progress } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
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
import { templatePrefix } from '../../utils/helpers'
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
    const [open, setOpen] = useState(false)
    const [showTemplate, setShowTemplate] = useState(false)
    const [templateData, setTemplateData] = useState({})

    useEffect(() => {
        dispatch(getAllSubmissions())
    }, [open])

    const showModal = () => {
        setOpen(true)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    if (showTemplate && templateData?.template_id) {
        return <SubmissionTemplate {...props} goBack={() => setShowTemplate(false)} templateData={templateData} />
    }

    return (
        <div className='template-screen'>
            <div className='row submission-head-div'>
                <div className='col-lg-2 pl-0'>
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
                <div className='col-lg-3'>
                    <RangePicker
                        className='date width'
                        defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                        format={dateFormat}
                    />
                </div>
                <div className='col-lg-3'>
                    <Input
                        className='date width'
                        placeholder='Search by ID or File name'
                        prefix={<BsSearch className='search-field-icon' />}
                    />
                </div>
                <div className='col-lg-4 pr-0'>
                    <div className='btn-specify'>
                        <Button style={{ background: '#4285F4', color: '#fff', width: '100%' }} onClick={showModal} className='date width-sub height_57px'
                        >Create Submission</Button>
                    </div>
                </div>
            </div>

            <div className='submission-div'>
                <div className='submission-card'>
                    <div className='submission-card-div'>
                        <div className='submission-main-list'>
                            <div className='submission-heading'>
                                <p className='submission-title mg_lf_15px'>{allSubmissions?.length} Templates</p>
                                <div className='processor-data'>
                                    <CiMenuKebab className='menuicon' />
                                </div>
                            </div>
                            <div className='submission-table-main'>
                                <TableContainer component={Paper} className='submission-table'>
                                    <Table aria-label='simple table'>
                                        <TableHead>
                                            <TableRow className='submission-head'>
                                                <TableCell className='submission-table-cell submission-head-cell'>Template ID</TableCell>
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
                                                            <Link onClick={() => (setShowTemplate(true), setTemplateData(v))}>{templatePrefix(v?.template_id)}</Link>
                                                        </TableCell>
                                                        <TableCell className='submission-table-cell submission-row-cell'>{v?.processor_name}</TableCell>
                                                        <TableCell className='submission-table-cell submission-row-cell'>{0}</TableCell>
                                                        <TableCell className='submission-table-cell submission-row-cell'>
                                                            <Progress
                                                                percent={50}
                                                                strokeColor={{ '0%': '#4285F4', '100%': '#87d068' }}
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
                            </div>
                            <div className='submissions-foote'>
                                <div className='display-flex'>
                                    <div className='select-main'>
                                        <div className='select-div'>
                                            <select name='pages' className='submission-pagination'>
                                                <option className='submission-pagination-option' value={5}>05</option>
                                                <option className='submission-pagination-option' value={10}>10</option>
                                                <option className='submission-pagination-option' value={20}>20</option>
                                            </select>
                                        </div>
                                        <p className='per-page'>Per Page</p>
                                    </div>
                                    <div className='pages-list'>
                                        <span className='page-list'>3</span>
                                        <span className='page-list'>of 2</span>
                                    </div>
                                </div>
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