import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axiosInstance.get('/api/fees').then(({ data }) => setFees(data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/fees', data);
      setFees([...fees, { id: Date.now(), ...data }]);
      setIsModalOpen(false);
      reset();
      toast.success('Fee assigned');
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  const columns = [
    { key: 'student_id', label: 'Student ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'paid_status', label: 'Status' },
    { key: 'due_date', label: 'Due Date' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Fees</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign Fee
      </button>
      <Table columns={columns} data={fees} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Fee">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Student ID" name="student_id" type="text" register={register} error={errors.student_id?.message} />
          <FormInput label="Amount" name="amount" type="number" register={register} error={errors.amount?.message} />
          <FormInput label="Due Date" name="due_date" type="date" register={register} error={errors.due_date?.message} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;