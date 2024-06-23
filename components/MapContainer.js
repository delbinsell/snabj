import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = ({ location, onClick }) => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyAD3WEkpcZhQ-S0iGmcoHl2jshQl6rXYD8">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '200px' }}
                zoom={14}
                center={location || { lat: 0, lng: 0 }}
                onClick={onClick}
            >
                {location && <Marker position={location} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;
