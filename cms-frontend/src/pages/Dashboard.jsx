import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosInstance.get(`/api/dashboard/${user?.role}`).then(({ data }) => setStats(data));
  }, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{user?.role} Dashboard</h1>
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Students: {stats.total_students || 0}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Bar
              data={{
                labels: ['Fees Due'],
                datasets: [
                  {
                    label: 'Amount',
                    data: [stats.total_fees_due || 0],
                    backgroundColor: '#2563eb',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
      )}
      {user?.role === 'faculty' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Courses</h2>
          <ul>
            {stats.courses?.map((course) => (
              <li key={course.id}>
                {course.name}: Avg Marks {course.avg_marks}%, Attendance {course.attendance_rate}%
              </li>
            ))}
          </ul>
        </div>
      )}
      {user?.role === 'student' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Your Stats</h2>
          <p>Attendance: {stats.attendance || 0}%</p>
          <p>Fees Due: ${stats.fees_due || 0}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;