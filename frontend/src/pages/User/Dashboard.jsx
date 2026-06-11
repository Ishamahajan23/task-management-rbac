import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/Button';
import { setMyTasks, setLoading } from '../../redux/task/taskSlice';
import { taskService } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { myTasks, isLoading } = useSelector(
    (state) => state.task
  );
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await taskService.getAllTasks();
        dispatch(setMyTasks(response.tasks || []));

        // Calculate stats
        const tasks = response.tasks || [];
        const completed = tasks.filter(
          (t) => t.status === TASK_STATUS.COMPLETED
        ).length;
        const pending = tasks.filter(
          (t) => t.status === TASK_STATUS.PENDING
        ).length;

        setStats({
          total: tasks.length,
          completed,
          pending,
        });
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch]);

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-2">A crisp overview of your task progress and recent activity.</p>
            </div>
            <Link to="/task/create">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer">
                + Add Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 lg:min-w-6xl">
            <div className="bg-white p-6 rounded-xl shadow flex items-center justify-around gap-4">

               <div className="">

              <h3 className="text-gray-600 text-sm font-medium">
                Total Tasks
              </h3>
              <p className="text-6xl font-bold text-sky-600 mt-2">
                {stats.total}
              </p>
                </div>

                <div className="flex items-center gap-4">

                  <i class="fa-solid fa-list-check text-4xl"></i>
                </div>
                </div>
          <div className="bg-white p-6 rounded-xl shadow flex items-center justify-around gap-4">
                <div className="">

              <h3 className="text-gray-600 text-sm font-medium">
                Completed Tasks
              </h3>
              <p className="text-6xl font-bold text-green-600 mt-2">
                {stats.completed}
              </p>
                </div>

                <div className="flex items-center gap-4">

                 <i class="fa-solid fa-check-double text-4xl"></i>
                </div>
            </div>
         <div className="bg-white p-6 rounded-xl shadow flex items-center justify-around gap-4">
                <div className="">

              <h3 className="text-gray-600 text-sm font-medium">
                Pending Tasks
              </h3>
              <p className="text-6xl font-bold text-red-600 mt-2">
                {stats.pending}
              </p>
                </div>
                <div className="flex items-center gap-4">

                <i class="fa-regular fa-hourglass-half text-4xl"></i>
                </div>
            </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Recent Tasks
          </h2>

          {isLoading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : myTasks.length === 0 ? (
            <p className="text-gray-600">No tasks yet</p>
          ) : (
            <div className="space-y-2 grid gap-4 md:grid-cols-2">
              {myTasks.slice(0, 6).map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        task.status === TASK_STATUS.COMPLETED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    <Link
                      to={`/task/edit/${task._id}`}
                      className="text-emerald-600 hover:underline cursor-pointer"
                    >
                      <i class="fa-solid fa-pen-to-square text-2xl"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
