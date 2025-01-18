import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, DatePicker, Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import moment from 'moment'
import { BsSearch } from 'react-icons/bs'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

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
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

const Option = []
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'

const Home = (props) => {

    useEffect(() => {
        console.log("HELLO")
    }, [])

    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = (e) => {
        console.log(e);
        setOpen(false);
    };
    const handleCancel = (e) => {
        console.log(e);
        setOpen(false);
    }

    return (
        <div className='template-screen'>
            <div className='row'>
                <div className='col-lg-2 pl-0'>
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
                <div className='col-lg-3'>
                    <RangePicker
                        // onChange={onChangeDate}
                        className='date width'
                        defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                        format={dateFormat}
                    />
                </div>
                <div className='col-lg-3'>
                    <Input
                        // onChange={getValue}
                        className='date width'
                        placeholder='Search by ID or File name'
                        prefix={<BsSearch className='search-field-icon' />}
                    />
                </div>
                <div className='col-lg-2'>

                </div>
                <div className='col-lg-2 pr-0'>
                    <Button style={{ background: '#4285F4', color: '#fff', width: '100%' }} onClick={showModal}
                        type='text' className='date width-sub height_57px'
                    >Create Submission</Button>
                    {/* ---------------------reate Submission modal Start--------------- */}
                    <Modal
                        title=""
                        open={open}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        type='navigation'
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
                                    <h6>Specialized </h6>
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
            </div>

            <div className='display-flex home-div'>
                <div className='submission-card'>
                    <div className='submission-card-div'>
                        <div className='submission-main-list'>
                            <div className='submission-heading'>
                                <p className='submission-title mg_lf_15px'>30 Templates</p>
                                <CiMenuKebab className='menuicon' />
                                {/* <button className='submission-btn' onClick={() => setShowCreateSubmission(true)}>Create Submission</button> */}
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
                                                // key={v?.submission_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            // onClick={() => { setSubID(v?.submission_id) }}
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
        </div>
    )
}

export default Home