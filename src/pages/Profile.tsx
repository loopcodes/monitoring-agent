import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, updateDoc } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [nin, setNin] = useState('');
  const [phone, setPhone] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || '');
            setNin(data.nin || '');
            setPhone(data.phone || '');
            setBankDetails({
              accountNumber: data.bankDetails?.accountNumber || '',
              bankName: data.bankDetails?.bankName || '',
              accountName: data.bankDetails?.accountName || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          name,
          nin,
          phone,
          bankDetails,
        });

        console.log('Profile updated successfully!');
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Details for Withdrawals</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Full Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">NIN:</label>
        <input
          type="text"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bank Account Number:</label>
          <input
            type="text"
            value={bankDetails.accountNumber}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountNumber: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bank Name:</label>
          <input
            type="text"
            value={bankDetails.bankName}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, bankName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Account Name:</label>
          <input
            type="text"
            value={bankDetails.accountName}
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfilePage;
