import { GoogleMap, LoadScript } from '@react-google-maps/api';


const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -34.397,
    lng: 150.644,
};

const GoogleMapsComponent = () => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyAD3WEkpcZhQ-S0iGmcoHl2jshQl6rXYD8">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            ></GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapsComponent;
