import React, { useState, useEffect } from "react";
import { db, collection, getDocs, updateDoc, doc } from "../firebaseConfig"; // Import Firebase functions

interface Report {
  id: string;
  description: string;
  location: string;
  status: string;
  intensity: number;
}

const DashboardTable: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  // Fetch reports data from Firestore on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsData: Report[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Ensure that all fields are present, even if some are missing in Firestore
          return {
            id: doc.id,
            description: data.description || "No description", // Provide default value if missing
            location: data.location || "Unknown location", // Provide default value if missing
            status: data.status || "Pending", // Default to "Pending"
            intensity: data.intensity || "0", // Default to "Low"
          };
        });
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports from Firestore:", error);
      }
    };

    fetchReports();
  }, []);

  // Handle marking a report as resolved
  const handleMarkResolved = async (id: string) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, {
        status: "Resolved", // Update the status to "Resolved"
      });
      // Update local state after successful update in Firestore
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: "Resolved" } : report
        )
      );
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full bg-white text-gray-800 table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Location</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Intensity</th>
            <th className="py-3 px-6 text-left">Action</th> {/* Added Action column */}
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b bg-gray-50 hover:bg-gray-100">
              <td className="py-3 px-6">{report.description}</td>
              <td className="py-3 px-6">{report.location}</td>
              <td
                className={`py-3 px-6 font-semibold ${
                  report.status === "Resolved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {report.status}
              </td>
              <td
                className={`py-3 px-6 font-semibold ${
                  report.intensity === 100
                    ? "text-red-600"
                    : report.intensity === 50
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {report.intensity}%
              </td>
              <td className="py-3 px-6">
                {/* Action button to mark report as resolved */}
                {report.status === "Pending" && (
                  <button
                    className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    onClick={() => handleMarkResolved(report.id)}
                  >
                    Mark as Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
