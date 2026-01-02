import React, { useState, useEffect } from "react";
import { db, collection, getDocs, addDoc, doc, updateDoc } from "../firebaseConfig"; 
import { auth } from "../firebaseConfig";

const ReportForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [location, setLocation] = useState<string>("");
  const [, setUserProfile] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const REWARD_PER_REPORT = 25;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocation(userLocation);
      });
    }

    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userSnapshot = await getDocs(collection(db, "users"));
        userSnapshot.forEach((doc) => {
          if (doc.id === user.uid) {
            const userData = doc.data();
            setUserProfile(userData);
            setPoints(userData.points || 0);
          }
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setSuccessMessage("User not authenticated.");
      return;
    }

    try {
      const newPoints = points + REWARD_PER_REPORT;

      const reportData = {
        userId: user.uid,
        description,
        intensity,
        location,
        createdAt: new Date(),
        points: REWARD_PER_REPORT,
        status: "Pending",
      };

      await addDoc(collection(db, "reports"), reportData);

      await updateDoc(doc(db, "users", user.uid), {
        points: newPoints,
      });

      setPoints(newPoints);
      setDescription("");
      setIntensity(0);
      setLocation("");
      setSuccessMessage("Report submitted successfully!");
    } catch (error) {
      console.error("Error adding report:", error);
      setSuccessMessage("Error submitting report. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    const user = auth.currentUser;
    if (!user || points < 100) {
      setSuccessMessage("You need at least 100 points to withdraw.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), { points: 0 });
      setPoints(0);
      setSuccessMessage("Withdrawal request submitted!");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      setSuccessMessage("Error processing withdrawal. Try again.");
    }
  };

  const getIntensityLabel = () => {
    if (intensity <= 33) return "Low";
    if (intensity <= 66) return "Medium";
    return "High";
  };

  const getIntensityLabelColor = () => {
    if (intensity <= 33) return "text-green-600";
    if (intensity <= 66) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl mx-auto mt-8 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Report Improper Refuse Disposal</h2>

      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the situation..."
        rows={5}
      />

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location or leave blank if automatic"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Waste Intensity Level: <span className={getIntensityLabelColor()}>{getIntensityLabel()}</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className={`w-full h-2 rounded-lg cursor-pointer ${intensity <= 33 ? "bg-green-400" : intensity <= 66 ? "bg-yellow-400" : "bg-red-400"}`}
        />
      </div>

      <button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        Submit Report
      </button>

      <div className="flex justify-between mt-4">
        
        <div className="flex gap-2">
          <label className="block mt-0.5 text-gray-700 font-bold ">Your Points:</label>
          <p className="text-lg font-semibold text-green-700">{points} Points</p>
        </div>
        
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={points < 100}
          className={` ${
            points < 100 ? "bg-gray-400 cursor-not-allowed" : "bg-green-800 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded-lg transition duration-300`}
        >
          Withdraw Points
        </button>
      </div>
      <p className="text-sm text-center mt-2 text-gray-700">You need at least <span className="font-bold text-red-600">100 points</span> to withdraw.</p>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-400 rounded-lg">
          {successMessage}
        </div>
      )}
    </form>
  );
};

export default ReportForm;
