import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { API_BASE_URL } from '../config';

export default function FeedbackModal({ open, onClose }) {
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        try {
            await fetch(`${API_BASE_URL}feedback/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ feedback }),
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>We’d love your feedback!</DialogTitle>
            <DialogContent>
                {submitted ? (
                    <p>Thank you for your feedback 🙏</p>
                ) : (
                    <TextField
                        autoFocus
                        multiline
                        rows={4}
                        fullWidth
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What did you think of your itinerary?"
                        variant="outlined"
                    />
                )}
            </DialogContent>
            <DialogActions>
                {!submitted ? (
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!feedback}>
                            Submit
                        </Button>
                    </>
                ) : (
                    <Button onClick={onClose}>Close</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
