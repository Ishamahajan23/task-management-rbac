import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setAllTasks, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';
import { TASK_STATUS } from '../../utils/constants';
import Button from '../../components/Button';
import ConfirmModal from '../../components/ConfirmModal';

const TaskMonitoring = () => {
  const dispatch = useDispatch();
  const { allTasks, isLoading } = useSelector(
    (state) => state.admin
  );
  const [confirm, setConfirm] = useState({ open: false, id: null, title: '' });
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await adminService.getAllTasks();
        dispatch(setAllTasks(response.tasks || []));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleDeleteTask = async () => {
    setConfirmLoading(true);
    try {
      await adminService.deleteTask(confirm.id);
      const updatedTasks = allTasks.filter((t) => t._id !== confirm.id);
      dispatch(setAllTasks(updatedTasks));
      setConfirm({ open: false, id: null, title: '' });
    } catch (error) {
      console.error('Failed to delete task', error);
      alert('Failed to delete task');
    } finally {
      setConfirmLoading(false);
    }
  };

  const openDeleteModal = (taskId, taskTitle) => {
    setConfirm({ open: true, id: taskId, title: taskTitle });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 p-6 shadow-sm bg-linear-to-r from-emerald-50 to-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Task Monitoring</h1>
              <p className="text-slate-600 mt-2">Monitor all tasks across the app and take safe action with confirmation dialogs.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden ring-1 ring-slate-200">
          {isLoading ? (
            <div className="p-8 text-center text-slate-600">Loading tasks...</div>
          ) : allTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No tasks found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Created</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {allTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-semibold">{task.title}</td>
                      <td className="px-6 py-4 text-slate-600">{task.user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          task.status === TASK_STATUS.COMPLETED
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          className=" text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => openDeleteModal(task._id, task.title)}
                        >
                          <i className="fa-solid fa-trash"></i>
                  
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Delete Task"
        message={`Are you sure you want to delete the task “${confirm.title}”? This action cannot be undone.`}
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirm({ open: false, id: null, title: '' })}
        loading={confirmLoading}
      />
    </AdminLayout>
  );
};

export default TaskMonitoring;
