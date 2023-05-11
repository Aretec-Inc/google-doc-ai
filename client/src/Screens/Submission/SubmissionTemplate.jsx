import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Select, DatePicker, Input, Button, Progress, Spin, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Grid from '@mui/material/Grid'
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
import UploadModal from '../../Components/Submission/UploadModal'
import SelectedDocument from '../../Components/SelectedDocument/SelectedDocument'
import { templatePrefix, errorMessage, convertTitle , validateLength} from '../../utils/helpers'
import { setDocuments } from '../../Redux/actions/docActions'
import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'

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

const SubmissionTemplate = (props) => {
    const { templateData, dispatch, goBack } = props
    const submission_id = templateData?.id
    const documents = useSelector((state) => state?.docReducer?.allDocuments?.[submission_id] || [])
    const [selectedDocument, setSelectedDocument] = useState({})
    const [showDocument, setShowDocument] = useState(false)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getDocuments()
    }, [open])

    const getDocuments = () => {
        if (!documents?.length) {
            setLoading(true)
        }

        secureApi.get(`${GET.DOCUMENTS_BY_ID}?submission_id=${submission_id}`)
            .then((data) => {
                dispatch(setDocuments({ [submission_id]: data?.documents || [] }))
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message
                errorMessage(errMsg)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const showModal = () => {
        setOpen(true)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const showPDFDocument = (doc) => {
        setSelectedDocument(doc)
        setShowDocument(true)
    }

    return (
        showDocument ? <SelectedDocument openModal={false} disableBack={true} closeModal={() => setShowDocument(false)} artifactData={selectedDocument} /> : <div className='template-screen'>
            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={2}>
                    <div className='back-arrow' onClick={goBack}>
                        <ArrowBackIcon />
                    </div>
                </Grid>
                <Grid item xl={2} lg={2} md={3} sm={5} xs={10}>
                    <Select
                        className='subdropdes'
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
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                    <RangePicker
                        defaultValue={[moment(moment(), dateFormat), moment(moment(), dateFormat)]}
                        format={dateFormat}
                    />
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={8} xs={12}>
                    <Input
                        placeholder='Search by ID or File name'
                        prefix={<BsSearch className='search-field-icon' />}
                    />
                </Grid>
                <Grid item xl={5} lg={5} md={12} sm={4} xs={12} style={{ textAlign: 'right' }}>
                    <Button style={{ background: '#4285F4', color: '#fff', width: '130px' }} onClick={showModal} className='date width-sub height_57px'
                    >Upload</Button>
                </Grid>
            </Grid>

            <div className='submission-div'>
                <div className='row'>
                    <div className='col-lg-12 p-0'>
                        <div className='tepm-id'>
                            <h5>Submission: {convertTitle(templateData?.submission_name)}</h5>
                        </div>
                    </div>
                </div>

                <Spin spinning={loading}>
                    <div className='submission-card'>
                        <div className='submission-card-div'>
                            <div className='submission-main-list'>
                                <div className='submission-heading margingless'>
                                    <p className='submission-title mg_lf_15px'>{documents?.length} Documents</p>
                                    <div className='processor-data'>
                                        <p>Processor: {templateData?.processor_name}</p>
                                        <CiMenuKebab className='menuicon' />
                                    </div>
                                </div>
                                <div className='exp-csv-btn'>
                                    <Button style={{ background: '#4285F4', color: '#fff', width: '100px' }} className='date width-sub height_57px'
                                    >Export Csv</Button>
                                </div>
                                <div className='submission-table-main'>
                                    <TableContainer component={Paper} className='submission-table'>
                                        <Table aria-label='simple table'>
                                            <TableHead>
                                                <TableRow className='submission-head'>
                                                    <TableCell className='submission-table-cell submission-head-cell'>File Name</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Average Confidence</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Status</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Created Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {documents?.map((v, i) => {
                                                    return (
                                                        <TableRow
                                                            key={i}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell className='submission-table-cell submission-row-cell'>
                                                                <Link onClick={() => showPDFDocument(v)}>
                                                                    <Tooltip placement='top' title={convertTitle(v?.original_file_name)} color={'#1890ff'}>
                                                                        {validateLength(convertTitle(v?.original_file_name), 30)}
                                                                    </Tooltip>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell className='submission-table-first-col submission-row-cell' component='th' scope='row'>
                                                                <Progress
                                                                    percent={50}
                                                                />
                                                            </TableCell>
                                                            <TableCell className='submission-table-cell submission-row-cell'>{v?.is_completed === true ? 'Completed' : 'Processing'}</TableCell>
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
                </Spin>
            </div>
            {open ? <UploadModal closeModal={handleCancel} {...props} /> : null}
        </div>
    )
}

export default SubmissionTemplate