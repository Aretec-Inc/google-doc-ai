import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BsBell } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import LOGO  from '../../assets/logo.svg'
import HOME  from '../../assets/home.svg'
import FORWARD  from '../../assets/forward.svg'
import MENU  from '../../assets/menu.svg'
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

export default function Home(props) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [tabActive, setTabActive] = useState('1');


    useEffect(() => {
        console.log("HELLO")
    }, [])



    return (
        <div className='main_container'>
            <section className='mainheader'>
                <div className='Top-header'>
                    <div className='header_left'>
                        <img src={LOGO} alt="" className='logomain'/>
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
            <section>
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
            </section>
            {/* <Box sx={{ width: '100%' }}>
                <Tabs className='virgin-tab' defaultActiveKey='1'>
                    <Tabs.TabPane tab="DEMOGRAPHIC DASHBOARD" key="1">
                        <div className='applicant-div'>
                            <h1>mkldnio </h1>
                        </div>
                    </Tabs.TabPane >
                    <Tabs.TabPane tab="CASES DASHBOARD" key="2">
                        <div className='submission-div'>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="SENTIMENT ANALYSIS" key="3">
                        <div className='submission-div'>
                        </div>
                    </Tabs.TabPane>
                </Tabs >
            </Box > */}
        </div >
    )
}