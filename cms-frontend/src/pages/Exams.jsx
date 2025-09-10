import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axiosInstance.get('/api/exams').then(({ data }) => setExams(data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/exams', data);
      setExams([...exams, { id: Date.now(), ...data }]);
      setIsModalOpen(false);
      reset();
      toast.success('Exam created');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const columns = [
    { key: 'course_id', label: 'Course ID' },
    { key: 'date', label: 'Date' },
    { key: 'total_marks', label: 'Total Marks' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Exams</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Exam
      </button>
      <Table columns={columns} data={exams} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Exam">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Course ID" name="course_id" type="text" register={register} error={errors.course_id?.message} />
          <FormInput label="Date" name="date" type="date" register={register} error={errors.date?.message} />
          <FormInput label="Total Marks" name="total_marks" type="number" register={register} error={errors.total_marks?.message} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Exams;