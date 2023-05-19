import { makeStyles } from '@material-ui/core/styles';
import { Button, DatePicker, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { secureApi } from '../../Config/api';
import DASHBOARD_ICON from '../../assets/icons/secondary_head_icons/dashblack.svg';
import { GET, POST } from '../../utils/apis';
import { errorMessage } from '../../utils/helpers';
import ProcessorVisuals from './ProcessorVisuals';
import SubmissionVisuals from './SubmissionVisuals';
import ConfidenceModel from './ConfidenceModel';
import ConfidenceSubmission from './ConfidenceSubmission';

const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'

const useStyles = makeStyles({
    tableHead: {
        backgroundColor: '#f5f5f5',
    },
});

const Dashboard = (props) => {
    const [documents, setDocuments] = useState('')
    const [submissions, setSubmissions] = useState('')
    const [accuracySubmission, setAccuracySubmission] = useState('')
    const [overAllConfidence, setOverAllConfidence] = useState('')
    const [totalNumbers, setTotalNumbers] = useState('')
    const [aboveThresholdModelAcc, setAboveThresholdModelAcc] = useState([])
    const [belowThresholdModelAcc, setBelowThresholdModelAcc] = useState([])
    const [confidenceModel, setConfidenceModel] = useState([])
    const [confidences, setAllConfidences] = useState([])
    const [submissionsList, setSubmissionsList] = useState([])
    const [submissionFilter, setSubmissionFilter] = useState('')
    const [confidenceFilter, setConfidenceFilter] = useState('')
    // const [accuracySubmission, setAccuracySubmission] = useState('')

    useEffect(() => {
        getDashboardData()
        getSubmissionsAndConfidence()
    }, [submissionFilter, confidenceFilter])

    const getDashboardData = () => {
        // if (!documents?.length) {
        //     setLoading(true)
        // }

        secureApi.post(`${POST.DASHBOARD_DATA}`, { submission: submissionFilter, confidence: confidenceFilter })
            .then((data) => {
                const { documents, submissions, accuracy, aboveThresholdValue, belowThresholdValue, totalFixes, aboveThresholdModel, belowThresholdModel, aboveArr, belowArr, accBySubmission, overAllConfidence, confidenceByModelFinalSchema } = data
                setDocuments(documents)
                setSubmissions(submissions)
                setOverAllConfidence(overAllConfidence)
                setAccuracySubmission(accBySubmission)
                setTotalNumbers(totalFixes)
                setBelowThresholdModelAcc(belowArr)
                setAboveThresholdModelAcc(aboveArr)
                setConfidenceModel(confidenceByModelFinalSchema)
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

    const getSubmissionsAndConfidence = () => {
        secureApi.get(`${GET.GET_SUB_AND_CONF}`)
            .then((data) => {
                const { confidence, submissions } = data
                setAllConfidences(confidence)
                setSubmissionsList(submissions)
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message
                errorMessage(errMsg)
            })
            .finally(() => {
                // setLoading(false)
            })
    }


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
            {/* <Divider /> */}
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
                            <div className='dash-top-card-main'>
                                <h1>Fields Transcribed</h1>
                                <p>{totalNumbers}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='row'>
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

                </div> */}
                <div>
                    {/* <div className="container-dash">
                        <div className="box-dash">
                            <SubmissionVisuals accuracySubmission={accuracySubmission} />
                        </div>
                        <div className="box-dash">
                            <ProcessorVisuals />
                        </div>
                    </div> */}
                    <div class="container-mid">
                        <div class="column-mid">
                            <SubmissionVisuals submissionsList={submissionsList} accuracySubmission={accuracySubmission} setSubmissionFilter={setSubmissionFilter} />
                        </div>
                        <div class="column-mid">
                            <ProcessorVisuals aboveThresholdModelAcc={aboveThresholdModelAcc} belowThresholdModelAcc={belowThresholdModelAcc} />
                        </div>
                    </div>
                    <div class="container-mid">
                        <div class="column-mid">
                            <ConfidenceSubmission confidences={confidences} setConfidenceFilter={setConfidenceFilter} overAllConfidence={overAllConfidence} />
                        </div>
                        <div class="column-mid">
                            <ConfidenceModel confidenceModel={confidenceModel} aboveThresholdModelAcc={aboveThresholdModelAcc} belowThresholdModelAcc={belowThresholdModelAcc} />
                        </div>
                    </div>
                    {/* Transcription Accuracy = Total Fields - How many Fields were changed (Shown as a number)

                    Accuracy By Submission = # of fields changed / the total number of fields (Shown as a percentage in Doughnut Chart)

                    Accuracy by Model(s) = # of fields changed / the total number of fields grouped by Model (Shown as a percentage in Horizontal Bar Chart)

                    Confidence Score by Submission = Aggregates of Confidence Score we receive from all models (Shown as a percentage in Doughnut Chart)

                    Confidence Score by Model = Aggregates of Confidence Score we receive from models grouped by models. (Shown as a percentage in Horizontal Bar Chart) */}
                    <div className="grid-container-bottom">
                        <div className="grid-item-card">
                            <b>Fields Transcribed:</b>
                            <br />
                            Total Fields - How many Fields were changed (Shown as a number)
                        </div>
                        <div className="grid-item-card">
                            <b> Accuracy By Submission:</b>
                            <br />
                            # of fields changed / the total number of fields (Shown as a percentage in Doughnut Chart)
                        </div>
                        <div className="grid-item-card">
                            <b> Accuracy by Model(s):</b><br /># of fields changed / the total number of fields grouped by Model (Shown as a percentage in Horizontal Bar Chart)
                        </div>
                        <div className="grid-item-card">
                            <b>Confidence Score by Submission:</b><br /> Aggregates of Confidence Score we receive from all models (Shown as a percentage in Doughnut Chart)
                        </div>
                        <div className="grid-item-card">
                            <b>Confidence Score by Model:</b><br />Aggregates of Confidence Score we receive from models grouped by models. (Shown as a percentage in Horizontal Bar Chart)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard