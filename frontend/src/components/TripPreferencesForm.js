import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem,
    FormGroup, FormControlLabel, Checkbox, CircularProgress, Alert,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { API_BASE_URL } from '../config';

function TripPreferencesForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: '', start_date: null, end_date: null,
        trip_styles: [], participants: 1, pace: 'MODERATE'
    });
    const [tripStyles, setTripStyles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTripStyles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}trip-styles/`);
                setTripStyles(response.data);
            } catch (error) {
                setErrorMessage('Failed to load trip styles.');
            }
        };
        fetchTripStyles();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'trip_styles') {
            setFormData((prev) => ({
                ...prev,
                trip_styles: checked ? [...prev.trip_styles, parseInt(value)] : prev.trip_styles.filter(id => id !== parseInt(value))
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
        }
    };

    const handleDateChange = (date, name) => setFormData(prev => ({ ...prev, [name]: date }));
    const handleDurationChange = (_, value) => setFormData(prev => ({ ...prev, duration: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const dataToSend = {
                destination: formData.destination,
                start_date: formData.start_date?.format('YYYY-MM-DD') || null,
                end_date: formData.end_date?.format('YYYY-MM-DD') || null,
                trip_styles: formData.trip_styles,
                participants: formData.participants,
                pace: formData.pace,
            };

            const response = await axios.post(`${API_BASE_URL}trip-preferences/`, dataToSend);
            navigate(`/loading/${response.data.id}`);
        } catch (error) {
            const err = error.response?.data || 'Unexpected error';
            setErrorMessage(typeof err === 'string' ? err : JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };
    const [paceOptions, setPaceOptions] = useState([]);

    useEffect(() => {
        const fetchPaceOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}pace-choices/`);
                setPaceOptions(response.data);
            } catch (error) {
                setErrorMessage('Failed to load pace options.');
            }
        };

        fetchPaceOptions();
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField label="Destination" name="destination" value={formData.destination} onChange={handleChange} required fullWidth sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker label="Start Date" value={formData.start_date} onChange={(date) => handleDateChange(date, 'start_date')} />
                    <DatePicker label="End Date" value={formData.end_date} onChange={(date) => handleDateChange(date, 'end_date')} />
                </Box>
                <FormGroup row>
                    {tripStyles.map((style) => (
                        <FormControlLabel
                            key={style.id}
                            control={<Checkbox checked={formData.trip_styles.includes(style.id)} onChange={handleChange} name="trip_styles" value={style.id} />}
                            label={style.name}
                        />
                    ))}
                </FormGroup>
                <TextField label="Participants" name="participants" type="number" value={formData.participants} onChange={handleChange} required sx={{ mt: 2 }} />
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Pace</InputLabel>
                    <Select name="pace" value={formData.pace} onChange={handleChange}>
                        {paceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 3 }}>
                    {loading ? <CircularProgress size={24} /> : 'Submit Preferences'}
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default TripPreferencesForm;