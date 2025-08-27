import { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";

function PlaceItem({ place }) {
    const [expanded, setExpanded] = useState(false);

    const shortAddress = place.place.formatted_address?.slice(0, 50) || "";
    const isLong = place.place.formatted_address && place.place.formatted_address.length > 50;

    return (
        <Box sx={{ mb: 1 }}>
            <Typography fontWeight="bold">{place.place.name}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {expanded || !isLong ? place.place.formatted_address : `${shortAddress}...`}
                {isLong && (
                    <Button
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ textTransform: "none", ml: 1, p: 0, minWidth: "auto" }}
                    >
                        {expanded ? "Show less" : "Read more"}
                    </Button>
                )}
            </Typography>
            <Typography variant="body2">Rating: {place.place.rating ?? "N/A"}</Typography>
        </Box>
    );
}

export default function ItineraryDaysList({ days }) {
    return (
        <Box>
            <Grid container spacing={3}>
                {days.map((day) => (
                    <Grid
                        item
                        key={day.id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            backgroundColor: "#fafafa",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Day {day.day_number} — {day.date}
                        </Typography>
                        {day.places.map((place) => (
                            <PlaceItem key={place.id} place={place} />
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
