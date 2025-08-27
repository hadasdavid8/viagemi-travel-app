import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Button,
    CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import html2pdf from "html2pdf.js";
import FeedbackModal from "../components/FeedbackModal";
import ItineraryMap from "../components/ItineraryMap";
import ItineraryDaysList from "../components/ItineraryDaysList";
import NavBar from '../components/NavBar';
import { API_BASE_URL } from '../config';

export default function ItineraryPage() {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);
    const printRef = useRef();
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => setShowFeedback(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {

        axios
            .get(`${API_BASE_URL}itinerary/${id}/`)
            .then((res) => setItinerary(res.data))
            .catch(() => setItinerary(null))
            .finally(() => setLoading(false));

        axios
            .get(`${API_BASE_URL}api/google-maps-api-key/`)
            .then((res) => setGoogleMapsApiKey(res.data.apiKey))
            .catch(() => setGoogleMapsApiKey(null));
    }, [id]);

    const handleDownloadPdf = () => {
        if (!printRef.current) return;
        const opt = {
            margin: 0.5,
            filename: `${itinerary?.destination || "itinerary"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().set(opt).from(printRef.current).save();
    };

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev);
    };


    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!itinerary) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="h5">No itinerary found with ID: {id}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <NavBar />
            <Box ref={printRef}>
                <Box sx={{ maxWidth: "1000px", mx: "auto", p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2} my={3} flexWrap="wrap">
                        <Typography variant="h4" whiteSpace="nowrap" flexShrink={0}>
                            {itinerary.destination}
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                height: "2px",
                                backgroundColor: "gray",
                                minWidth: "150px",
                                marginX: 2,
                            }}
                        />

                        <Typography variant="body1" whiteSpace="nowrap" flexShrink={0}>
                            {itinerary.start_date} - {itinerary.end_date} (
                            {itinerary.total_days} days)
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Button variant="contained" onClick={handleDownloadPdf}>
                            Download PDF
                        </Button>
                        <Tooltip title="Add to favorites">
                            <IconButton
                                onClick={toggleFavorite}
                                color={isFavorite ? "warning" : "default"}
                            >
                                {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 3, overflowX: "auto" }}>
                        <ItineraryDaysList days={itinerary.days} />
                    </Grid>

                    <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Route Map
                        </Typography>

                        {googleMapsApiKey && itinerary && (
                            <ItineraryMap days={itinerary.days} googleMapsApiKey={googleMapsApiKey} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}