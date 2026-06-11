import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/Button';
import { setMyTasks, setLoading } from '../../redux/task/taskSlice';
import { taskService } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';

const ACCENT_BAR = {
  slate: 'bg-gradient-to-r from-slate-400 to-slate-500',
  emerald: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  amber: 'bg-gradient-to-r from-amber-400 to-orange-400',
};

const StatCard = ({ label, value, subtitle, icon, colorClass, bgClass, barClass, loading }) => (
  <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 overflow-hidden transition hover:shadow-md">
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${barClass}`} />
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      {loading ? (
        <span className="skeleton h-8 w-16 inline-block mt-1" />
      ) : (
        <>
          <p className={`text-3xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </>
      )}
    </div>
  </div>
);

const TaskSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2 flex-1">
        <span className="skeleton h-4 w-3/4 inline-block" />
        <span className="skeleton h-3 w-1/2 inline-block" />
      </div>
      <span className="skeleton h-6 w-20 inline-block rounded-full" />
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { myTasks, isLoading } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await taskService.getAllTasks();
        dispatch(setMyTasks(response.tasks || []));
        const tasks = response.tasks || [];
        const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
        const pending = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;
        setStats({ total: tasks.length, completed, pending });
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchTasks();
  }, [dispatch]);

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const firstName = user?.name ? user.name.split(' ')[0] : null;

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-emerald-100"
          style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #f0fdfa 100%)' }}
        >
          <div className="absolute right-0 top-0 h-full w-56 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />
          <div className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Overview</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {firstName ? `Hello, ${firstName} 👋` : 'Dashboard'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Here's a snapshot of your task progress today.</p>
            </div>
            <Link to="/task/create">
              <Button variant="primary" className="cursor-pointer shrink-0">
                + Add Task
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            subtitle="all time"
            loading={isLoading}
            colorClass="text-slate-800"
            bgClass="bg-slate-100"
            barClass={ACCENT_BAR.slate}
            icon={
              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            subtitle={stats.total > 0 ? `${completionPct}% completion rate` : 'no tasks yet'}
            loading={isLoading}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            barClass={ACCENT_BAR.emerald}
            icon={
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            subtitle={stats.pending > 0 ? 'need attention' : 'all caught up!'}
            loading={isLoading}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
            barClass={ACCENT_BAR.amber}
            icon={
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {!isLoading && stats.total > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Overall completion</span>
                {completionPct === 100 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">All done!</span>
                )}
              </div>
              <span className="text-sm font-semibold text-emerald-600">{completionPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #5FB56A, #169179)' }}
                role="progressbar"
                aria-valuenow={completionPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{stats.completed} of {stats.total} tasks completed</p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Tasks</h2>
              {!isLoading && myTasks.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">Showing {Math.min(6, myTasks.length)} of {myTasks.length}</p>
              )}
            </div>
            <Link to="/my-tasks" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              View all
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <TaskSkeleton key={i} />)}
              </div>
            ) : myTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
                  <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No tasks yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Create your first task to get started</p>
                <Link to="/task/create" className="mt-4">
                  <Button variant="primary" className="cursor-pointer text-xs">
                    Create a task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {myTasks.slice(0, 6).map((task) => (
                  <Link
                    key={task._id}
                    to={`/task/edit/${task._id}`}
                    className="group relative flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3.5 pl-5 overflow-hidden transition hover:border-emerald-200 hover:bg-white hover:shadow-sm cursor-pointer"
                    aria-label={`Edit ${task.title}`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      task.status === TASK_STATUS.COMPLETED ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{task.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                      {task.createdAt && (
                        <p className="text-xs text-slate-300 mt-1">
                          {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.status === TASK_STATUS.COMPLETED
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
