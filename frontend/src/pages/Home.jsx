import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NavBar from '../components/NavBar';
import backgroundImage from '../assets/photos/view.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleStartPlanningClick = () => {
        navigate('/trip_preferences');
    };

    return (
        <Box
            sx={{
                minHeight: '695px',
                width: '100%',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <NavBar transparent={true} />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '20px',
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                    }}
                >
                    Every Destination . Every Budget . Every Person.
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 4,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                    }}
                >
                    create your perfect trip with personalized itineraries, tailored to your budget, style and pace
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleStartPlanningClick}

                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'primary.main',
                        padding: '12px 30px',
                        borderRadius: '30px',
                        '&:hover': {
                            backgroundColor: 'white',
                        },
                    }}
                >
                    Start Planning Trip
                </Button>
            </Box>
        </Box>
    );
};

export default Home;