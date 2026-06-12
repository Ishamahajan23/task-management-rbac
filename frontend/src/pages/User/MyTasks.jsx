import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import Button from '../../components/Button';
import TaskModal from '../../components/TaskModal';
import ConfirmModal from '../../components/ConfirmModal';
import { setMyTasks, setLoading, deleteTask } from '../../redux/task/taskSlice';
import { taskService } from '../../services/taskService';
import { TASK_STATUS } from '../../utils/constants';

const TaskSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2 flex-1">
        <span className="skeleton h-4 w-3/5 inline-block" />
        <span className="skeleton h-3 w-4/5 inline-block" />
      </div>
      <span className="skeleton h-6 w-20 inline-block rounded-full shrink-0" />
    </div>
    <div className="flex gap-2 pt-1">
      <span className="skeleton h-8 w-8 inline-block rounded-lg" />
      <span className="skeleton h-8 w-8 inline-block rounded-lg" />
      <span className="skeleton h-8 w-8 inline-block rounded-lg" />
    </div>
  </div>
);

const FILTERS = ['All', 'Pending', 'Completed'];

const MyTasks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myTasks, myTasksLoaded, isLoading } = useSelector((state) => state.task);
  const [viewingTask, setViewingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, title: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (myTasksLoaded) return;
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
  }, [dispatch, myTasksLoaded]);

  const openDeleteConfirm = (taskId, taskTitle) => {
    setDeleteConfirm({ open: true, id: taskId, title: taskTitle });
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(deleteConfirm.id);
      dispatch(deleteTask(deleteConfirm.id));
      setDeleteConfirm({ open: false, id: null, title: '' });
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleView = (task) => setViewingTask(task);
  const handleCloseView = () => setViewingTask(null);

  const completed = myTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const pending = myTasks.filter((t) => t.status === TASK_STATUS.PENDING).length;

  const visibleTasks = myTasks.filter((t) => {
    if (filter === 'Completed') return t.status === TASK_STATUS.COMPLETED;
    if (filter === 'Pending') return t.status === TASK_STATUS.PENDING;
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading ? 'Loading…' : `${myTasks.length} task${myTasks.length !== 1 ? 's' : ''} · ${completed} completed · ${pending} pending`}
            </p>
          </div>
          <Link to="/task/create">
            <Button variant="primary" className="cursor-pointer">
              + Add Task
            </Button>
          </Link>
        </div>

        {!isLoading && myTasks.length > 0 && (
          <div className="flex gap-1.5" role="tablist" aria-label="Filter tasks">
            {FILTERS.map((f) => {
              const count = f === 'All' ? myTasks.length : f === 'Completed' ? completed : pending;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    filter === f
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {f}
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                    filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            {filter !== 'All' ? (
              <>
                <p className="text-base font-semibold text-slate-700">No {filter.toLowerCase()} tasks</p>
                <p className="text-sm text-slate-400 mt-1">Switch to "All" to see everything.</p>
                <button onClick={() => setFilter('All')} className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  Show all tasks
                </button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-slate-700">No tasks yet</p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs">You haven't created any tasks. Add your first one to get started.</p>
                <Link to="/task/create" className="mt-5">
                  <Button variant="primary" className="cursor-pointer">Create your first task</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleTasks.map((task) => (
              <div
                key={task._id}
                role="button"
                tabIndex={0}
                onClick={() => handleView(task)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleView(task); }}
                className="group relative rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 overflow-hidden cursor-pointer"
                aria-label={`Open ${task.title}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  task.status === TASK_STATUS.COMPLETED ? 'bg-emerald-500' : 'bg-amber-400'
                }`} />

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openDeleteConfirm(task._id, task.title); }}
                  className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer z-10"
                  aria-label={`Delete ${task.title}`}
                  title="Delete"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="pl-5 pr-10 pt-5 pb-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{task.title}</h2>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.status === TASK_STATUS.COMPLETED
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.status}
                    </span>
                    {task.createdAt && (
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Click to view & edit
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal open={!!viewingTask} title="Task Details" onClose={handleCloseView}>
        {viewingTask && (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Title</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800">
                  {viewingTask.title}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    viewingTask.status === TASK_STATUS.COMPLETED
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {viewingTask.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Description</label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 whitespace-pre-wrap min-h-[80px]">
                {viewingTask.description}
              </div>
            </div>

            {viewingTask.createdAt && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {new Date(viewingTask.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={handleCloseView}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                className="cursor-pointer"
                onClick={() => { handleCloseView(); navigate(`/task/edit/${viewingTask._id}`); }}
              >
                Edit Task
              </Button>
            </div>
          </div>
        )}
      </TaskModal>

      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete task"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, title: '' })}
        loading={deleteLoading}
      />
    </UserLayout>
  );
};

export default MyTasks;
