import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserLayout from '../../layouts/UserLayout';
import { addTask } from '../../redux/task/taskSlice';
import { taskService } from '../../services/taskService';
import TaskModal from '../../components/TaskModal';
import TaskForm from '../../components/TaskForm';

const CreateTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await taskService.createTask(formData);
      if (response?.task) {
        dispatch(addTask(response.task));
      }
      navigate('/my-tasks');
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <TaskModal open title="Create Task" onClose={() => navigate('/my-tasks')}>
        <TaskForm
          mode="Create"
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/my-tasks')}
          loading={loading}
          error={error}
        />
      </TaskModal>
    </UserLayout>
  );
};

export default CreateTask;
