import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

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

export default function Home(props) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [tabActive, setTabActive] = useState('1');


    useEffect(() => {
        console.log("HELLO")
    }, [])

  

    return (
        <div className='main_container'>
            <p className='sub_cont_forms'></p>
            <Box sx={{ width: '100%' }}>
                <Tabs className='virgin-tab' defaultActiveKey='1'>
                    <Tabs.TabPane tab="DEMOGRAPHIC DASHBOARD" key="1">
                        <div className='applicant-div'>
                          <h1>mkldnio </h1>
                          </div>
                    </Tabs.TabPane >
                    <Tabs.TabPane tab="CASES DASHBOARD" key="2">
                        <div className='submission-div'>
                            {/* <iframe className='dashboard_iframe' src="https://datastudio.google.com/embed/u/0/reporting/5377631e-6a93-4bc6-a211-7179055f6785/page/YVd7C" frameBorder={0} allowFullScreen /> */}
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="SENTIMENT ANALYSIS" key="3">
                        <div className='submission-div'>
                            {/* <iframe className='dashboard_iframe' src="https://datastudio.google.com/embed/reporting/adf93041-428b-478e-b578-6872d9725b1b/page/xtS5C" frameborder={0} allowfullscreen /> */}
                        </div>
                    </Tabs.TabPane>
                </Tabs >
            </Box >
        </div >
    )
}