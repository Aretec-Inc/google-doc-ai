import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Select, DatePicker, Input, Button } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
    const [open, setOpen] = useState(false)

    const showModal = () => {
        setOpen(true)
    }

    const handleOk = (e) => {
        console.log(e)
        setOpen(false)
    }

    const handleCancel = (e) => {
        setOpen(false)
    }

    return (
        <div className='template-screen'>
            <div className='row'>
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
                {/* <div className='col-lg-2'>

                </div> */}
                <div className='col-lg-4 pr-0'>
                    <div className='btn-specify'>
                        <Button style={{ background: '#4285F4', color: '#fff', width: '100%' }} onClick={showModal} className='date width-sub height_57px'
                        >Create Submission</Button>
                    </div>
                </div>
            </div>


            <div className='submission-div'>
                <div className='row'>
                    <div className='col-lg-12 p-0'>
                        <div className='tepm-id'>
                            <h5>Template ID:3275</h5>
                        </div>
                    </div>
                </div>
                <div className='submission-card'>
                    <div className='submission-card-div'>
                        <div className='submission-main-list'>
                            <div className='submission-heading'>
                                <p className='submission-title mg_lf_15px'>30 Templates</p>
                                <div className='processor-data'>
                                    <p>Processor:Invoice Parser</p>
                                    <CiMenuKebab className='menuicon' />
                                </div>
                            </div>
                            <div className='submission-table-main'>
                                <TableContainer component={Paper} className='submission-table'>
                                    <Table aria-label='simple table'>
                                        <TableHead>
                                            <TableRow className='submission-head'>
                                                <TableCell className='submission-table-cell submission-head-cell'>Name</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Submission ID</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Description</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Date</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Status</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Completion Date</TableCell>
                                                <TableCell className='submission-table-cell submission-head-cell'>Uploaded By</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className='submission-table-first-col pointer submission-row-cell' component='th' scope='row'>
                                                    ddkcbj
                                                </TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>ncdj</TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>cds</TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>cds</TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>vdvsd</TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>csd</TableCell>
                                                <TableCell className='submission-table-cell submission-row-cell'>scsdcsdc</TableCell>
                                            </TableRow>
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
            {open ? <SubmissionModal closeModal={handleCancel} /> : null}
        </div>
    )

    // return (
    //     <div className='template-screen'>
    //         <div className='row'>
    //             <div className='col-lg-2 pl-0'>
    //                 <Select
    //                     className='width subdropdes'
    //                     showSearch
    //                     placeholder='Filter'
    //                     optionFilterProp='children'
    //                     filterOption={(input, option) => option?.children?.includes(input)}
    //                     filterSort={(optionA, optionB) =>
    //                         optionA?.children?.toLowerCase()?.localeCompare(optionB?.children?.toLowerCase())
    //                     }
    //                 >
    //                     <Option value='Communicated'>Communicated</Option>
    //                 </Select>
    //             </div>
    //             <div className='col-lg-3'>
    //                 <RangePicker
    //                     // onChange={onChangeDate}
    //                     className='date width'
    //                     defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
    //                     format={dateFormat}
    //                 />
    //             </div>
    //             <div className='col-lg-3'>
    //                 <Input
    //                     // onChange={getValue}
    //                     className='date width'
    //                     placeholder='Search by ID or File name'
    //                     prefix={<BsSearch className='search-field-icon' />}
    //                 />
    //             </div>
    //             <div className='col-lg-2'>

    //             </div>
    //             <div className='col-lg-2 pr-0'>
    //                 <Button style={{ background: '#4285F4', color: '#fff', width: '100%' }} onClick={showModal} className='date width-sub height_57px'
    //                 >Create Submission</Button>
    //             </div>
    //         </div>


    //         <div className='submission-div'>
    //             <div className='row'>
    //                 <div className='col-lg-12 p-0'>
    //                     <div className='tepm-id'>
    //                         <h5>Template ID:3275</h5>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className='submission-card'>
    //                 <div className='submission-card-div'>
    //                     <div className='submission-main-list'>
    //                         <div className='submission-heading margingless'>
    //                             <p className='submission-title mg_lf_15px'>30 Templates</p>
    //                             <div className='processor-data'>
    //                                 <p>Processor:Invoice Parser</p>
    //                                 <CiMenuKebab className='menuicon' />
    //                             </div>
    //                             {/* <button className='submission-btn' onClick={() => setShowCreateSubmission(true)}>Create Submission</button> */}
    //                         </div>
    //                         <div className='exp-csv-btn'>
    //                             <Button style={{ background: '#4285F4', color: '#fff', width: '100px' }} className='date width-sub height_57px'
    //                             >Export Csv</Button>
    //                         </div>
    //                         <div className='submission-table-main'>
    //                             <TableContainer component={Paper} className='submission-table'>
    //                                 <Table aria-label='simple table'>
    //                                     <TableHead>
    //                                         <TableRow className='submission-head'>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Row</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Name</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Submission ID</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Description</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Date</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Status</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Completion Date</TableCell>
    //                                             <TableCell className='submission-table-cell submission-head-cell'>Uploaded By</TableCell>
    //                                         </TableRow>
    //                                     </TableHead>
    //                                     <TableBody>
    //                                         <TableRow
    //                                             // key={v?.submission_id}
    //                                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //                                         // onClick={() => { setSubID(v?.submission_id) }}
    //                                         >
    //                                             <TableCell className='submission-table-cell submission-row-cell firstcell_table'>1</TableCell>
    //                                             <TableCell className='submission-table-first-col submission-row-cell' component='th' scope='row'>
    //                                                 ddkcbj
    //                                             </TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>ncdj</TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>cds</TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>cds</TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>vdvsd</TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>csd</TableCell>
    //                                             <TableCell className='submission-table-cell submission-row-cell'>scsdcsdc</TableCell>
    //                                         </TableRow>
    //                                     </TableBody>
    //                                 </Table>
    //                             </TableContainer>
    //                         </div>
    //                         <div className='submissions-foote'>
    //                             <div className='display-flex'>
    //                                 <div className='select-main'>
    //                                     <div className='select-div'>
    //                                         <select name='pages' className='submission-pagination'>
    //                                             <option className='submission-pagination-option' value={5}>05</option>
    //                                             <option className='submission-pagination-option' value={10}>10</option>
    //                                             <option className='submission-pagination-option' value={20}>20</option>
    //                                         </select>
    //                                     </div>
    //                                     <p className='per-page'>Per Page</p>
    //                                 </div>
    //                                 <div className='pages-list'>
    //                                     <span className='page-list'>3</span>
    //                                     <span className='page-list'>of 2</span>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //         {open ? <SubmissionModal closeModal={handleCancel} /> : null}
    //     </div>
    // )
}

export default Submission