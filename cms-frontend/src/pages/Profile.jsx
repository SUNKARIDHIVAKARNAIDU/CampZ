import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axiosInstance.get('/api/dashboard/student').then(({ data }) => setProfile(data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Attendance:</strong> {profile.attendance || 0}%</p>
        <p><strong>Fees Due:</strong> ${profile.fees_due || 0}</p>
        <h2 className="text-lg font-semibold mt-4">Marks</h2>
        <ul>
          {profile.marks?.map((mark) => (
            <li key={mark.exam_id}>
              Exam {mark.exam_id}: {mark.obtained_marks}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;