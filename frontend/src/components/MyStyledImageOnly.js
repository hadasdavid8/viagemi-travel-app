import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import PhotoTry from '../assets/photos/travel-inspiration/travel-inspiration1.jpg';

function MyStyledImageOnly() {
    return (
        <CardMedia
            component="img"
            image={PhotoTry}
            sx={{
                width: '25%',
                maxWidth: {
                    xs: '90vw',
                    sm: '70vw',
                    md: '60vw',
                    lg: '60vw',
                },
                height: {
                    xs: 200,
                    sm: 200,
                    md: 230,
                    lg: 260,
                    xl: 290,
                },
                objectFit: 'cover',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                my: 2,
                ml: 5,
                border: '2px solid rgba(163, 193, 232, 0.8)',
            }}
        />
    );
}

export default MyStyledImageOnly;