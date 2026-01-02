import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from '../firebaseConfig';
import DashboardTable from '../components/DashboardTable';
import UserTable from '../components/UserTable';
import MapView from '../components/maps/MapView';

const Dashboard: React.FC = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [position, setPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  useEffect(() => {
    // Fetch reports from Firebase
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reports'));
        const reports = querySnapshot.docs.map((doc) => doc.data());

        // Calculate report counts
        const total = reports.length;
        const resolved = reports.filter((report) => report.status === 'Resolved').length;
        const pending = reports.filter((report) => report.status === 'Pending').length;

        // Update state
        setTotalReports(total);
        setResolvedReports(resolved);
        setPendingReports(pending);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      (error) => console.error('Error getting location:', error)
    );
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Reports</h1>

      {/* Flexbox layout for the report summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Total Reports</h3>
          <p className="text-3xl text-blue-500">{totalReports}</p>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Resolved Reports</h3>
          <p className="text-3xl text-green-500">{resolvedReports}</p>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Pending Reports</h3>
          <p className="text-3xl text-red-500">{pendingReports}</p>
        </div>
      </div>

      <div className="my-6">
        <DashboardTable />
      </div>

      <MapView position={position} locations={[]} />

      <h1 className="text-3xl font-bold mt-6 mb-4 text-white">Users</h1>
      <div className="my-6">
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard;
