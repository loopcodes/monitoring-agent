import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, query, where } from '../firebaseConfig';

interface User {
  id: string;
  name: string;
  email: string;
  reports: number;
  points: number;
  withdrawalRequest: boolean;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, 'users'));
        let usersData: User[] = [];

        for (const userDoc of userSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          // Fetch reports count for each user from the reports collection
          const reportsSnapshot = await getDocs(query(collection(db, 'reports'), where('userId', '==', userId)));
          const reportsCount = reportsSnapshot.size;

          usersData.push({
            id: userId,
            name: userData.name || 'Unknown',
            email: userData.email,
            reports: reportsCount,
            points: userData.points || 0,
            withdrawalRequest: userData.withdrawalRequest || false,
          });
        }

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject', points: number) => {
    try {
      const userRef = doc(db, 'users', id);
      if (action === 'accept') {
        // Deduct points only after approval
        await updateDoc(userRef, { withdrawalRequest: false, points: points - 100 });
      } else {
        // Reject the withdrawal request without deducting points
        await updateDoc(userRef, { withdrawalRequest: false });
      }

      alert(`${action === 'accept' ? 'Accepted' : 'Rejected'} withdrawal request for user.`);

      // Update local user list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, withdrawalRequest: false, points: action === 'accept' ? user.points - 100 : user.points } : user
        )
      );
    } catch (error) {
      console.error('Error updating withdrawal request:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-white text-black rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Number of Reports</th>
            <th className="px-4 py-2">Points</th>
            <th className="px-4 py-2">Withdrawal Request</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t text-center">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.reports}</td>
              <td className="px-4 py-2">{user.points}</td>
              <td className="px-4 py-2">
                {user.withdrawalRequest ? 'Pending' : 'None'}
              </td>
              <td className="px-4 py-2">
                {user.withdrawalRequest ? (
                  <div className="flex space-x-2 justify-center">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm sm:text-base"
                      onClick={() => handleAction(user.id, 'accept', user.points)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm sm:text-base"
                      onClick={() => handleAction(user.id, 'reject', user.points)}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
