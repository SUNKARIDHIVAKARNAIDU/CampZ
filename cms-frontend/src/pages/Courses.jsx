import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axiosInstance.get('/api/courses').then(({ data }) => setCourses(data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/courses', data);
      setCourses([...courses, { id: Date.now(), ...data }]);
      setIsModalOpen(false);
      reset();
      toast.success('Course added');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const columns = [
    { key: 'name', label: 'Course Name' },
    { key: 'department', label: 'Department' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Course
      </button>
      <Table columns={columns} data={courses} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Course">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Name" name="name" type="text" register={register} error={errors.name?.message} />
          <FormInput label="Department" name="department" type="text" register={register} error={errors.department?.message} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;