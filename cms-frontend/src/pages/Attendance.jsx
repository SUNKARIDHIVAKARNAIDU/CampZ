import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import Table from '../components/Table';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    axiosInstance.get('/api/students').then(({ data }) => setStudents(data));
    axiosInstance.get('/api/attendance').then(({ data }) => setAttendance(data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/attendance', {
        course_id: data.course_id,
        date: data.date,
        records: students.map((s) => ({
          student_id: s.id,
          status: data[`status_${s.id}`],
        })),
      });
      toast.success('Attendance marked');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const columns = [
    { key: 'student_id', label: 'Student ID' },
    { key: 'course_id', label: 'Course ID' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            {...register('course_id')}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            {...register('date')}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {students.map((student) => (
          <div key={student.id} className="mb-2">
            <label>{student.name}</label>
            <select {...register(`status_${student.id}`)} className="ml-2 p-1 border rounded">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Mark Attendance
        </button>
      </form>
      <Table columns={columns} data={attendance} />
    </div>
  );
};

export default Attendance;