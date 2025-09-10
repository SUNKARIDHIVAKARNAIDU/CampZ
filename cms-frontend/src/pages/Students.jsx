import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axiosInstance.get('/api/students').then(({ data }) => setStudents(data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/students', data);
      setStudents([...students, { id: Date.now(), ...data }]);
      setIsModalOpen(false);
      reset();
      toast.success('Student added');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
      toast.success('Student deleted');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'year', label: 'Year' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600"
          aria-label={`Delete ${row.name}`}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Student
      </button>
      <Table columns={columns} data={students} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Student">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Name" name="name" type="text" register={register} error={errors.name?.message} />
          <FormInput label="Email" name="email" type="email" register={register} error={errors.email?.message} />
          <FormInput label="Year" name="year" type="text" register={register} error={errors.year?.message} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Students;