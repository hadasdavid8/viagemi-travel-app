import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "450px",
    borderRadius: "8px",
};

const dayColors = ["#FF5733", "#33A1FF", "#28A745", "#FFC107", "#6F42C1"];

export default function ItineraryMap({ days, googleMapsApiKey }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey,
    });

    if (!isLoaded) return <div>Loading map...</div>;

    const markers = [];
    const polylines = [];

    days.forEach((day, index) => {
        const dayCoordinates = day.places
            .map((p) => ({
                lat: p.place.latitude,
                lng: p.place.longitude,
                name: p.place.name,
            }))
            .filter((coord) => typeof coord.lat === "number" && typeof coord.lng === "number");

        markers.push(
            ...dayCoordinates.map((coord) => ({
                ...coord,
                dayIndex: index,
            }))
        );

        if (dayCoordinates.length > 1) {
            polylines.push({
                path: dayCoordinates,
                color: dayColors[index % dayColors.length],
            });
        }
    });

    const center = markers.length > 0 ? markers[0] : { lat: 0, lng: 0 };

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {markers.map((marker, idx) => (
                <Marker
                    key={idx}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: dayColors[marker.dayIndex % dayColors.length],
                        fillOpacity: 1,
                        strokeWeight: 1,
                    }}
                />
            ))}

            {polylines.map((line, idx) => (
                <Polyline
                    key={idx}
                    path={line.path}
                    options={{
                        strokeColor: line.color,
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                    }}
                />
            ))}
        </GoogleMap>
    );
}
