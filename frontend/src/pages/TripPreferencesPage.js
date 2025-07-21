import React from 'react';
import { Box, Typography } from '@mui/material';
import TripPreferencesForm from '../components/TripPreferencesForm';
import NavBar from '../components/NavBar';

function TripPreferencesPage() {
    return (
        <Box>
            <NavBar />
            <Box sx={{ px: 2, py: 5, maxWidth: 900, mx: 'auto' }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ textAlign: 'center', mb: 3, color: 'rgba(163, 193, 232, 0.8)' }}
                >
                    Tell Us About Your Dream Trip!
                </Typography>

                <Box sx={{ width: '100%' }}>
                    <TripPreferencesForm />
                </Box>
            </Box>
        </Box>
    );
}

export default TripPreferencesPage;
