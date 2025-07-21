import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

import logo from '../assets/photos/logo_viagemi.png';

export default function NavBar({ transparent = false }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { label: 'Home', to: '/' },
        { label: 'Plan Trip', to: '/trip_preferences' },
        { label: 'My Trips', to: '/my-trips' },
        { label: 'Budget Tracker', to: '/budget-tracker' },
        { label: 'Blog', to: '/blog' },
    ];

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.to}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: transparent ? 'transparent' : 'rgba(255, 255, 255, 0.9)',
                    boxShadow: transparent ? 'none' : '0px 2px 4px rgba(0,0,0,0.1)',
                    padding: '10px 20px',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <img
                            src={logo}
                            alt="Viagemi Logo"
                            style={{
                                height: '50px',
                                marginRight: '10px',
                            }}
                        />
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                color: transparent ? 'white' : 'text.primary',
                                textShadow: transparent ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                            }}
                        >
                            viagemi
                        </Typography>
                    </Box>

                    {/* כפתור המבורגר לטלפונים */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            color={transparent ? 'inherit' : 'default'}
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* תפריט רחב למסכים גדולים */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                to={item.to}
                                color="inherit"
                                sx={{
                                    color: transparent ? 'white' : 'text.primary',
                                    textShadow: transparent
                                        ? '1px 1px 2px rgba(0,0,0,0.5)'
                                        : 'none',
                                    textTransform: 'none',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </>
    );
}
