import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const API_BASE_URL = 'http://127.0.0.1:8000/';

function LoadingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let interval;

        const fetchData = async () => {
            try {
                await axios.get(`${API_BASE_URL}recommendations/${id}/`);
                console.log('Recommendations ready');

                interval = setInterval(async () => {
                    try {
                        const response = await axios.get(`${API_BASE_URL}itinerary/${id}/`);
                        console.log('Polling itinerary:', response.data);

                        if (response.data && response.data.days && response.data.days.length > 0) {
                            clearInterval(interval);
                            navigate(`/itinerary/${id}`);
                        }
                    } catch (err) {
                        console.log('Itinerary not ready yet...');
                    }
                }, 3000);

            } catch (err) {
                console.error('Failed to load recommendations:', err);
            }
        };

        fetchData();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [id, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            padding={3}
        >
            <CircularProgress size={60} />
            <Typography variant="h5" mt={4}>
                We're building your trip itinerary..
            </Typography>
            <Typography variant="body1" mt={2}>
                This might take a few seconds while we search the best recommendations.
            </Typography>
        </Box>
    );
}

export default LoadingPage;
