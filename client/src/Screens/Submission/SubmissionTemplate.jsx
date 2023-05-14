import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DatePicker from 'antd/lib/date-picker'
import Button from 'antd/lib/button'
import Progress from 'antd/lib/progress'
import Tooltip from 'antd/lib/tooltip'
import Spin from 'antd/lib/spin'
import Input from 'antd/lib/input'
import Pagination from 'antd/lib/pagination'
import Divider from 'antd/lib/divider'
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
import Slider from '@mui/material/Slider'
import UploadModal from '../../Components/Submission/UploadModal'
import SelectedDocument from '../../Components/SelectedDocument/SelectedDocument'
import FLAG from '../../assets/flag.svg'
import { errorMessage, convertTitle, validateLength, disabledDate, itemRender } from '../../utils/helpers'
import { setDocuments } from '../../Redux/actions/docActions'
import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import SHARE_ICON from '../../assets/icons/secondary_head_icons/shareblack.svg'


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

const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'

const SubmissionTemplate = (props) => {
    const { templateData, dispatch, goBack } = props
    const submission_id = templateData?.id
    const threshold = templateData?.threshold
    const allFiles = useSelector((state) => state?.docReducer?.allDocuments?.[submission_id] || [])
    const [totalFiles, setTotalFiles] = useState(0)
    const [selectedFile, setSelectedFiles] = useState({})
    const [showDocument, setShowDocument] = useState(false)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState('')
    const [dateRange, setDateRange] = useState(null)
    const [pageSize, setPageSize] = useState(10)
    const [pageNo, setPageNo] = useState(1)

    useEffect(() => {
        getAllFiles()
    }, [open, fileName, dateRange, pageNo, pageSize])

    const getAllFiles = () => {
        if (!allFiles?.length) {
            setLoading(true)
        }

        let obj = {
            fileName,
            dateRange,
            pageNo,
            pageSize
        }

        secureApi.post(`${GET.FILES_BY_ID}?submission_id=${submission_id}`, obj)
            .then((data) => {
                dispatch(setDocuments({ [submission_id]: data?.documents || [] }))
                setTotalFiles(data?.totalFiles || 0)
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
        setSelectedFiles(doc)
        setShowDocument(true)
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

    return (
        showDocument ? <SelectedDocument openModal={false} disableBack={true} closeModal={() => setShowDocument(false)} artifactData={selectedFile} /> : <div className='template-screen'>
            <div className='secondary_header_container'>
                <div className='left_sec_head'>
                    <div className='secondary_header_left'>
                        <img width={'30px'} src={SHARE_ICON} alt='SHARE_ICON' />
                        <h2 className='secondary_header_heading'>
                            Submission
                        </h2>
                    </div>
                    <h2 className='secondary_header_heading'>
                        Services
                    </h2>
                    <Button type='text' className='secondary_header_buttons mg_lft_4rem' onClick={showModal}>
                        <span className="material-symbols-outlined">
                            upload_file
                        </span>
                        <span>
                            UPLOAD
                        </span>
                    </Button>
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
            <Grid container spacing={1} justifyContent={'space-between'}>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <div className='back-arrow' onClick={goBack}>
                        <ArrowBackIcon />
                    </div>
                </Grid>
                <Grid item xl={3} lg={3} md={4} sm={5} xs={5}>
                    <RangePicker
                        format={dateFormat}
                        style={{ width: '100%' }}
                        className='ant-radius'
                        disabledDate={disabledDate}
                        onChange={setRange}
                    />
                </Grid>
                <Grid item xl={8} lg={8} md={7} sm={6} xs={6}>
                    <Input
                        placeholder='Search by ID or File name'
                        className='ant-radius'
                        prefix={<BsSearch className='search-field-icon' />}
                        onChange={(e) => setFileName(e?.target?.value)}
                        style={{ maxWidth: 600 }}
                    />
                </Grid>
                {/* <Grid item xl={2} lg={2} md={12} sm={4} xs={12} style={{ textAlign: 'right' }}>
                    <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Threshold</h4>
                        <Slider
                            value={threshold}
                            aria-label='Default'
                            valueLabelDisplay='auto'
                            onChange={(e) => setThreshold(e?.target?.value)}
                        />
                    </div>
                </Grid> */}
            </Grid>

            <div className='submission-div'>
                <Grid container justifyContent={'space-between'}>
                    <Grid item>
                        <div className='tepm-id'>
                            <h5>Submission: {convertTitle(templateData?.submission_name)}</h5>
                        </div>
                    </Grid>
                    <Grid item>
                        <div className='tepm-id'>
                            <h5>Threshold: {threshold}</h5>
                        </div>
                    </Grid>
                </Grid>

                <Spin spinning={loading}>
                    <div className='submission-card'>
                        <div className='submission-card-div'>
                            <div className='submission-main-list'>
                                <div className='submission-heading margingless'>
                                    <p className='submission-title mg_lf_15px'>{totalFiles || allFiles?.length} Documents</p>
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
                                        <Table
                                            size="small" aria-label="a dense table"
                                        // aria-label='simple table'
                                        >
                                            <TableHead>
                                                <TableRow className='submission-head'>
                                                    <TableCell className='submission-table-cell submission-head-cell'>File Name</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Average Confidence</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Status</TableCell>
                                                    <TableCell className='submission-table-cell submission-head-cell'>Created Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {allFiles?.map((v, i) => {
                                                    return (
                                                        <TableRow
                                                            key={i}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell className='submission-table-cell submission-row-cell'>
                                                                <Link onClick={() => showPDFDocument(v)}>
                                                                    <Tooltip placement='top' title={convertTitle(v?.original_file_name)}>
                                                                        {validateLength(convertTitle(v?.original_file_name), 30)}
                                                                    </Tooltip>
                                                                </Link>
                                                                {v?.is_completed === true && v?.min_confidence < threshold ? <img src={FLAG} className='file-flag' /> : null}
                                                            </TableCell>
                                                            <TableCell className='submission-table-first-col submission-row-cell' component='th' scope='row'>
                                                                <Progress
                                                                    percent={v?.average_confidence}
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
                                    <Pagination
                                        total={totalFiles || allFiles?.length || 0}
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
                </Spin>
            </div>
            {open ? <UploadModal closeModal={handleCancel} {...props} /> : null}
        </div>
    )
}

export default SubmissionTemplate