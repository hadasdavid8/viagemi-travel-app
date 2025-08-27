import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import NavBar from '../components/NavBar';
function BlogPage() {
    return (
        <Box>
            <NavBar />
            <Box
                sx={{
                    px: 2,
                    py: 5,
                    maxWidth: 900,
                    mx: 'auto',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                }}
            >
                <ConstructionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Blog Coming Soon!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, maxWidth: '600px' }}>
                    We're busy crafting insightful articles, travel tips, and exciting stories for you.
                    Check back soon for updates!
                </Typography>
                <CircularProgress sx={{ mt: 4 }} />
            </Box>
        </Box>
    );
}

export default BlogPage;