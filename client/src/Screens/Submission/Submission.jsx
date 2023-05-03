import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Select, DatePicker, Input, Button, Modal } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BsBell } from 'react-icons/bs'
import { CiMenuKebab } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import LOGO from '../../assets/logo.svg'
import HOME from '../../assets/home.svg'
import FORWARD from '../../assets/forward.svg'
import MENU from '../../assets/menu.svg'
import LOCALDRIVE from '../../assets/localdrive.svg'
import DRIVE from '../../assets/drive.svg'
import AMAZON from '../../assets/S3.svg'

import { BsSearch } from 'react-icons/bs'
import moment from 'moment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
// import UPLOAD  from '../../assets/upload.svg'

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
    value: PropTypes.number.isRequired,
};

const Option = [];
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD'
export default function Submission(props) {

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
    };
    return (
        <div className='main_container'>
            <section className='mainheader'>
                <div className='Top-header'>
                    <div className='header_left'>
                        <img src={LOGO} alt="" className='logomain' />
                    </div>
                    <div className='right_side'>
                        <div className='name_space'>
                            <BsBell className='user_icon' />
                        </div>
                        <div className='loginuser'>
                            <div className='loginuser-img'></div>
                            <div className='loginname'>
                                <h6>john Dae</h6>
                                <span>john@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='main-screen'>
                <div className='sidenav_sidenav'>
                    <div className='sidebar-sub'>
                        <div className='navlink-menu'>
                            <a href="/"><img src={HOME} alt="" /></a>
                            <span>Dashboard</span>
                        </div>
                        <div className='navlink-menu'>
                            <a href="/"><img src={FORWARD} alt="" /></a>
                            <span>Submissions</span>
                        </div>
                        <div className='navlink-menu'>
                            <a href="/"><img src={FORWARD} alt="" /></a>
                            <span>Upload</span>
                        </div>
                        <div className='navlink-menu'>
                            <a href="/"><img src={MENU} alt="" /></a>
                            <span>Configuration</span>
                        </div>
                    </div>
                </div>
                <div className='main-section'>
                    <div className='main-container'>
                        {/* ------------------      es div ma screen ke component rakh na --------------------- */}

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
                                    <Button style={{ background: '#4285F4', color: '#fff' ,width:'100%'}} onClick={showModal}
                                        type='text' className='date width-sub height_57px'
                                        >Upload</Button>
                                           <Modal
                                        title=""
                                        open={open}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        footer={null}
                                        type='navigation'
                                        width={1000}
                                    >

                                        <div className='select-process'>
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
                                        </div>
                                    </Modal>
                                    {/* =========== Now another button upload button Code with modal code End==================== */}
                                </div>
                            </div>

                            <div className='display-flex home-div'>
                                <div className='submission-card'>
                                    <div className='submission-card-div'>
                                        <div className='submission-main-list'>
                                            <div className='submission-heading'>
                                                <p className='submission-title mg_lf_15px'>30 Submissions</p>
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







                    </div>
                </div>
            </section>
        </div >
    )
}