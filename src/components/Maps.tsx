import { HotelListResponse } from '@/utils/types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRef, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface MapsProps {
  hotels: HotelListResponse[];
}

const Maps = ({ hotels }: MapsProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 }); // Default center (Istanbul)
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (hotels.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      hotels.forEach((hotel) => {
        const lat = hotel.latitude;
        const lng = hotel.longitude;

        if (lat && lng) {
          bounds.extend({ lat: lat, lng: lng });
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        setCenter(bounds.getCenter().toJSON());
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onMapLoad}
      >
        {hotels.map((hotel, index) =>
          hotel.latitude && hotel.longitude ? (
            <Marker
              key={hotel.id || index}
              position={{ lat: hotel.latitude, lng: hotel.longitude }}
              title={hotel.name}
            />
          ) : null
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Maps;
