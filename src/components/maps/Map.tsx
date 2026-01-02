import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  message: string;
}

interface MapProps {
  position: { lat: number; lng: number }; // Current GPS position
  locations: Location[]; // Array of locations to display markers
}

const Map: React.FC<MapProps> = ({ position, locations }) => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([position.lat, position.lng], 13);

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Marker for the current location
    L.marker([position.lat, position.lng])
      .addTo(map)
      .bindPopup('Your Location')
      .openPopup();

    // Add markers for other locations
    locations.forEach(location => {
      L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(location.message);
    });

    return () => {
      map.remove(); // Cleanup on component unmount
    };
  }, [position, locations]); // Re-run effect if position or locations change

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default Map;