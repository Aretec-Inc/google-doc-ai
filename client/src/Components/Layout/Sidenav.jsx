import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import allPaths from '../../Config/paths';

const drawerWidth = 250;

const Sidenav = ({ toggleHeader, setToggleHeader }) => {
    const navigate = useNavigate();
    
    // Navigation items configuration
    const navItems = [
        {
            title: 'Dashboard',
            path: allPaths?.DASHBOARD,
            icon: 'full_stacked_bar_chart',
            onClick: () => navigate(allPaths?.DASHBOARD)
        },
        {
            title: 'Submissions',
            path: 'submission',
            icon: 'screen_share',
            onClick: () => navigate(allPaths?.SUBMISSION)
        },
        {
            title: 'Configuration',
            path: 'configuration',
            icon: 'settings',
            onClick: () => navigate(allPaths?.CONFIGURATION)
        }
    ];

    // Get current path for active state
    const currentPath = window.location.pathname.split('/')[1] || '';

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="temporary"
                anchor="left"
                open={toggleHeader}
                onClose={() => setToggleHeader(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        marginTop: '64px', // Height of your header
                        backgroundColor: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                }}
            >
                <div className="h-full">
                    <List sx={{ padding: '16px 0' }}>
                        {navItems.map((item) => (
                            <ListItem 
                                key={item.title} 
                                disablePadding 
                                sx={{ 
                                    mb: '4px',
                                    '& .MuiListItemButton-root:hover': {
                                        backgroundColor: '#f3f4f6'
                                    }
                                }}
                            >
                                <ListItemButton
                                    onClick={item.onClick}
                                    sx={{
                                        borderRadius: '8px',
                                        mx: 1,
                                        backgroundColor: currentPath === item.path ? '#f3f4f6' : 'transparent'
                                    }}
                                >
                                    <ListItemIcon>
                                        <span 
                                            className={`material-symbols-outlined ${
                                                currentPath === item.path ? 'text-blue-600' : 'text-gray-600'
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.title}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: currentPath === item.path ? '#2563eb' : '#4b5563',
                                                fontWeight: currentPath === item.path ? 500 : 400
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </Box>
    );
};

export default Sidenav;