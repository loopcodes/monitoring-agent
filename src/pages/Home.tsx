// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import backgroundImage from '../assets/hawkesbury-river-1378381.jpg'; // Replace with your actual image path

const Home: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="overflow-hidden">
      <div
        className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center animate-zoomIn"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Refuse <span className="text-green-600">Monitoring</span>
          </h1>
          <p className="text-2xl mb-6">
            Join us in keeping Nsukka metropolis clean and green.
          </p>
          <button
            onClick={() => navigate('/report')} // Navigate to login page
            className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Make a report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
