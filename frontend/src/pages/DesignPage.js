import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Grid, Card, CardContent, IconButton, Tooltip, Button, } from '@mui/material';
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MyStyledImageOnly from "../components/MyStyledImageOnly";

const DesignPage = () => {
    const [itinerary, setItinerary] = useState(null);
    return (
        <div>
            <Box display="flex" alignItems="center" gap={1} my={1}>
                <Box flex={1} p={2} >

                </Box>

                <Box flex={1} p={2} >
                    <Typography variant="h3">Tokyo</Typography>
                </Box>

                <Box flex={1} p={2} >
                    <Box sx={{ flexGrow: 1, height: '2px', backgroundColor: 'gray' }} />
                </Box>
                <Box flex={1} p={2} display="flex" alignItems="center" gap={3}>
                    <Typography>Start: 23/07/25</Typography>
                    <Typography>End: 29/07/25</Typography>
                </Box>
                <Box flex={1} p={2} >

                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Button >
                    Download PDF
                </Button>

                <Tooltip title="Add to favorites">
                    <IconButton >
                        {<StarBorderIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            <Box>
                gbbgc
            </Box>

            <MyStyledImageOnly />

            <Box>
                Day 1 - 23/07/25
            </Box>
        </div >
    )
}

export default DesignPage
