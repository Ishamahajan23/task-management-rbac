import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import { taskService } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';
import TaskModal from '../../components/TaskModal';
import TaskForm from '../../components/TaskForm';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await taskService.getTaskById(id);
        setFormData(response);
      } catch {
        setError('Failed to load task');
      }
    };

    fetchTask();
  }, [id]);

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
      await taskService.updateTask(id, formData);
      navigate('/my-tasks');
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <TaskModal open title="Edit Task" onClose={() => navigate('/my-tasks')}>
        <TaskForm
          mode="Update"
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

export default EditTask;
