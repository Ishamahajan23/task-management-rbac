import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/Button';
import TaskModal from '../../components/TaskModal';
import { setMyTasks, setLoading, deleteTask } from '../../redux/task/taskSlice';
import { taskService } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';

const MyTasks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myTasks, isLoading } = useSelector(
    (state) => state.task
  );
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await taskService.getAllTasks();
        dispatch(setMyTasks(response.tasks || []));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        dispatch(deleteTask(taskId));
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleView = (task) => {
    setViewingTask(task);
  };

  const handleCloseView = () => {
    setViewingTask(null);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
              <p className="text-slate-500 mt-2">Manage your tasks quickly with inline controls and a clean task overview.</p>
            </div>
            <Link to="/task/create">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                + Add Task
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Loading tasks...
            </div>
          ) : myTasks.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              No tasks found
            </div>
          ) : (
            <div className="space-y-4 grid gap-4 md:grid-cols-2">
              {myTasks.map((task) => (
                <div key={task._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>
                      <p className="mt-2 text-slate-600 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end items-start">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        task.status === TASK_STATUS.COMPLETED
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {task.status}
                      </span>
                      <div className="flex gap-3">
                        <Link to={`/task/edit/${task._id}`} className="text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer">
                          <i className="fa-solid fa-pen-to-square text-xl"></i>
                        </Link>
                        <button
                          onClick={() => handleView(task)}
                          className="text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                        >
                          <i className="fa-solid fa-eye text-xl"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                        >
                          <i className="fa-solid fa-trash text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Task Modal */}
      <TaskModal
        open={!!viewingTask}
        title="View Task"
        onClose={handleCloseView}
      >
        {viewingTask && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Task Title</label>
                <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800">
                  {viewingTask.title}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    viewingTask.status === TASK_STATUS.COMPLETED
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {viewingTask.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 whitespace-pre-wrap">
                {viewingTask.description}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                onClick={() => {
                  handleCloseView();
                  navigate(`/task/edit/${viewingTask._id}`);
                }}
              >
                Edit Task
              </Button>
              <Button
                type="button"
                className="bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer"
                onClick={handleCloseView}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </TaskModal>
    </UserLayout>
  );
};

export default MyTasks;
