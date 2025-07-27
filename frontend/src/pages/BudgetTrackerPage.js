import React from 'react';
import { Box, Typography } from '@mui/material';
import NavBar from '../components/NavBar';

function BudgetTrackerPage() {
    return (
        <Box>
            <NavBar />
            <Box sx={{ px: 2, py: 5, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Budget Tracker
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    This is where you'll be able to track your trip expenses.
                    Stay tuned for upcoming features!
                </Typography>
            </Box>
        </Box>
    );
}

export default BudgetTrackerPage;