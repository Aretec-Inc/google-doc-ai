import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HOME from '../../assets/home.svg'
import FORWARD from '../../assets/forward.svg'
import MENU from '../../assets/menu.svg'
import allPaths from '../../Config/paths'
import LOGO from '../../assets/logo.svg'
import MENU_LOGO from '../../assets/sidebar_icons/menu.svg'
import { BsBell } from 'react-icons/bs'
// import { Drawer, IconButton } from "@material-ui/core";
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const drawerWidth = 240;

const Sidenav = (props) => {

    const { toggleHeader, setToggleHeader } = props;

    const navigate = useNavigate()
    console.log("TOGGLE HEADER SIDE NAV ===>", toggleHeader)

    const clickToogle = () => {
        setToggleHeader((state) => !state)
    }

    const gotoDashboard = () => {
        navigate(allPaths?.DASHBOARD)
    }
    const gotoSubmission = () => {
        navigate(allPaths?.SUBMISSION)
    }
    const gotoConfiguration = () => {
        navigate(allPaths?.CONFIGURATION)
    }

    return (
        // <div className='sidenav_sidenav'>
        //     <div className='sidebar-sub'>
        //         <div className='navlink-menu'>
        //             <Link to={allPaths?.DASHBOARD}><img src={HOME} alt='' /></Link>
        //             <span>Dashboard</span>
        //         </div>
        //         <div className='navlink-menu'>
        //             <Link to={allPaths?.SUBMISSION}><img src={FORWARD} alt='' /></Link>
        //             <span>Submissions</span>
        //         </div>
        //         {/* <div className='navlink-menu'>
        //             <Link to={allPaths?.DASHBOARD}><img src={FORWARD} alt='' /></Link>
        //             <span>Upload</span>
        //         </div> */}
        //         <div className='navlink-menu'>
        //             <Link to={allPaths?.CONFIGURATION}><img src={MENU} alt='' /></Link>
        //             <span>Configuration</span>
        //         </div>
        //     </div>
        // </div>
        // <Drawer
        //     anchor="left"
        //     // width='100px'
        //     // sx={{ width: 250 }}
        //     style={{ marginTop: '20px' }} // set the marginTop to 20px
        //     role="presentation"
        //     open={toggleHeader}
        //     onClose={() => setToggleHeader(false)}>
        //     <div
        //         style={{ width: 300 }}
        //         onClick={() => setToggleHeader(false)}
        //     >
        //         <List>
        //             {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
        //                 <ListItem key={text} disablePadding>
        //                     <ListItemButton>
        //                         <ListItemIcon>
        //                             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        //                         </ListItemIcon>
        //                         <ListItemText primary={text} />
        //                     </ListItemButton>
        //                 </ListItem>
        //             ))}
        //         </List>
        //     </div>
        // </Drawer>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <section className='mainheader'>
                    <div className='Top-header'>
                        <div className='header_left'>
                            <span className="material-symbols-outlined menu_bar_icon" onClick={clickToogle}>
                                menu
                            </span>
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
            </AppBar>
            <Drawer
                anchor="left"
                // width='100px'
                // sx={{ width: 250 }}
                style={{ marginTop: '20px' }} // set the marginTop to 20px
                role="presentation"
                open={toggleHeader}
                onClose={() => setToggleHeader(false)}>
                <div
                    className='drawer_cont'
                    style={{ width: 250, marginTop: '60px' }}
                    onClick={() => setToggleHeader(false)}
                >
                    <List>
                        <ListItem key='1' className='each_side' disablePadding onClick={gotoDashboard}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {/* <span className="material-symbols-outlined">
                                        dashboard
                                    </span> */}
                                    <span className={`${window.location.href.split('/')[3] == '' ? 'material-symbols-outlined active_icon' : 'material-symbols-outlined'}`}>
                                        full_stacked_bar_chart
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" className={`${window.location.href.split('/')[3] == '' ? 'active_tag' : ''}`} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='2' className='each_side' disablePadding onClick={gotoSubmission}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <span className={`${window.location.href.split('/')[3] == 'submission' ? 'material-symbols-outlined active_icon' : 'material-symbols-outlined'}`}>
                                        screen_share
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary="Submissions" className={`${window.location.href.split('/')[3] == 'submission' ? 'active_tag' : ''}`} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='3' className='each_side' disablePadding onClick={gotoConfiguration}>
                            <ListItemButton>
                                <ListItemIcon className=''>
                                    <span
                                        className={`${window.location.href.split('/')[3] == 'configuration' ? 'material-symbols-outlined active_icon' : 'material-symbols-outlined'}`}
                                    // className="material-symbols-outlined active_icon"
                                    >
                                        settings
                                    </span>
                                </ListItemIcon>
                                <ListItemText primary="Configuration" className={`${window.location.href.split('/')[3] == 'configuration' ? 'active_tag' : ''}`} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </Box>
    )
}

export default Sidenav