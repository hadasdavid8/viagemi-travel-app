import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem,
    FormGroup, FormControlLabel, Checkbox, CircularProgress, Alert,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const API_BASE_URL = 'http://127.0.0.1:8000/';

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





/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, CircularProgress,
    Alert, Slider,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const API_BASE_URL = 'http://127.0.0.1:8000/';

function TripPreferencesForm() {
    const [formData, setFormData] = useState({
        destination: '',
        start_date: null,
        end_date: null,
        duration: [1, 7],
        trip_styles: [],
        participants: 1,
        pace: 'MODERATE',
    });
    const [tripStyles, setTripStyles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const paceOptions = [
        { value: 'RELAXED', label: 'Relaxed' },
        { value: 'MODERATE', label: 'Moderate' },
        { value: 'FAST', label: 'Fast' },
        { value: 'ADVENTUROUS', label: 'Adventurous' },
    ];

    useEffect(() => {
        const fetchTripStyles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}trip-styles/`);
                setTripStyles(response.data);
            } catch (error) {
                console.error("Error fetching trip styles:", error);
                setErrorMessage('Failed to load trip styles. Please try again later.');
            }
        };

        fetchTripStyles();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'trip_styles') {
            setFormData((prevData) => {
                const newStyles = checked
                    ? [...prevData.trip_styles, parseInt(value)]
                    : prevData.trip_styles.filter((styleId) => styleId !== parseInt(value));
                return { ...prevData, trip_styles: newStyles };
            });
        } else if (type === 'number') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: parseInt(value) || 0,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleDateChange = (date, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: date,
        }));
    };

    const handleDurationChange = (event, newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            duration: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const dataToSend = {
                destination: formData.destination,
                start_date: formData.start_date ? formData.start_date.format('YYYY-MM-DD') : null,
                end_date: formData.end_date ? formData.end_date.format('YYYY-MM-DD') : null,
                duration: formData.duration[1],
                trip_styles: formData.trip_styles,
                participants: formData.participants,
                pace: formData.pace,
            };

            const response = await axios.post(`${API_BASE_URL}trip-preferences/`, dataToSend);

            setSuccessMessage('Trip preferences submitted successfully! Planning your dream trip...');
            console.log('Submission successful:', response.data);

            if (response.data && response.data.itinerary) {
                console.log('Generated Itinerary:', response.data.itinerary);
            } else {
                console.warn('Recommender did not return an itinerary directly in the response.');
            }

            setFormData({
                destination: '',
                start_date: null,
                end_date: null,
                duration: [1, 7],
                trip_styles: [],
                participants: 1,
                pace: 'MODERATE',
            });

        } catch (error) {
            console.error('Submission error:', error.response ? error.response.data : error.message);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                const errors = error.response.data;
                let errorMsg = 'Submission failed: ';
                if (typeof errors === 'object' && errors !== null) {
                    for (const key in errors) {
                        if (Array.isArray(errors[key])) {
                            errorMsg += `${key}: ${errors[key].join(', ')} | `;
                        } else {
                            errorMsg += `${key}: ${errors[key]} | `;
                        }
                    }
                } else if (typeof errors === 'string') {
                    errorMsg = `Submission failed: ${errors}`;
                }
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    p: 3,
                    maxWidth: 700,
                    mx: 'auto',
                    mb: 4,
                }}
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                {successMessage && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{errorMessage}</Alert>}

                <TextField
                    label="Destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    sx={{
                        width: '60%',
                        mx: 'auto',
                        mb: 2,
                        mt: 1,
                        flexBasis: '100%'
                    }}
                />

                <DatePicker
                    label="Start Date"
                    value={formData.start_date}
                    onChange={(date) => handleDateChange(date, 'start_date')}
                    slotProps={{ textField: { required: true } }}
                    sx={{ width: 'calc(50% - 8px)' }}
                />
                <DatePicker
                    label="End Date"
                    value={formData.end_date}
                    onChange={(date) => handleDateChange(date, 'end_date')}
                    slotProps={{ textField: { required: true } }}
                    sx={{ width: 'calc(50% - 8px)' }}
                />

                <FormControl fullWidth sx={{ m: 1, width: 'calc(100% - 16px)' }}>
                    <Typography id="range-slider" gutterBottom>
                        Duration (Days)
                    </Typography>
                    <Slider
                        getAriaLabel={() => 'Duration range'}
                        value={formData.duration}
                        onChange={handleDurationChange}
                        valueLabelDisplay="auto"
                        min={1}
                        max={30}
                        marks={[
                            { value: 1, label: '1 Day' },
                            { value: 7, label: '7 Days' },
                            { value: 14, label: '14 Days' },
                            { value: 30, label: '30 Days' },
                        ]}
                    />
                </FormControl>

                <FormControl component="fieldset" sx={{ m: 1, width: '100%' }}>
                    <Typography variant="subtitle1" component="legend">Trip Styles:</Typography>
                    {loading && tripStyles.length === 0 && <CircularProgress size={24} />}
                    <FormGroup
                        sx={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        {tripStyles.map((style) => (
                            <FormControlLabel
                                key={style.id}
                                control={
                                    <Checkbox
                                        checked={formData.trip_styles.includes(style.id)}
                                        onChange={handleChange}
                                        name="trip_styles"
                                        value={style.id}
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        {style.name}
                                    </Typography>
                                }
                                sx={{
                                    width: 'calc(16.66% - 8px)',
                                    flexGrow: 0,
                                    flexShrink: 0,
                                    flexBasis: 'auto',
                                    margin: '4px',
                                    boxSizing: 'border-box',
                                    marginBottom: '12px',
                                }}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 2,
                        mb: 2,
                        mt: 1,
                    }}
                >
                    <TextField
                        label="Number of Participants"
                        name="participants"
                        type="number"
                        value={formData.participants}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        required
                        sx={{
                            flexGrow: 1,
                            width: 'calc(50% - 8px)',
                        }}
                    />

                    <FormControl
                        sx={{
                            flexGrow: 1,
                            width: 'calc(50% - 8px)',
                        }}
                    >
                        <InputLabel id="pace-label">Pace</InputLabel>
                        <Select
                            labelId="pace-label"
                            id="pace"
                            name="pace"
                            value={formData.pace}
                            label="Pace"
                            onChange={handleChange}
                            required
                        >
                            {paceOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                        backgroundColor: 'rgba(163, 193, 232, 0.8)',
                        color: 'primary.main',
                        mt: 3,
                        mb: 2,
                        width: 'calc(100% - 16px)',
                        mx: 'auto',
                        borderRadius: '30px',
                        '&:hover': {
                            backgroundColor: 'white',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit Preferences'}
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default TripPreferencesForm;
*/