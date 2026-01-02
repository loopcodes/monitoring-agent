import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  position: { lat: number; lng: number };
  locations: { lat: number; lng: number; message: string; intensity: string }[];
}

const getColorByIntensity = (intensity: string): string => {
  switch (intensity) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'blue';
  }
};

const MapView: React.FC<MapViewProps> = ({ position, locations }) => {
  useEffect(() => {
    const map = L.map('map').setView([position.lat, position.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Display the user's location
    L.marker([position.lat, position.lng])
      .addTo(map)
      .bindPopup('Your Location')
      .openPopup();

    // Add markers based on locations and intensity
    locations.forEach(({ lat, lng, message, intensity }) => {
      const color = getColorByIntensity(intensity);
      const marker = L.circleMarker([lat, lng], {
        color,
        radius: 20, // Adjust size if needed
        fillOpacity: 0.6
      });

      marker.bindPopup(`${message} - Intensity: ${intensity}`).addTo(map);
    });

    // Clean up map on component unmount
    return () => {
      map.remove();
    };
  }, [position, locations]);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default MapView;