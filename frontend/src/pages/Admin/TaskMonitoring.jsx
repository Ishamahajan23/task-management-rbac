import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setAllTasks, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';
import { TASK_STATUS } from '../../utils/constants';
import ConfirmModal from '../../components/ConfirmModal';

const TableSkeleton = ({ cols = 5, rows = 6 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-t border-slate-100">
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j} className="px-5 py-3.5">
            <span className="skeleton h-4 w-full inline-block" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const TaskMonitoring = () => {
  const dispatch = useDispatch();
  const { allTasks, isLoading } = useSelector((state) => state.admin);
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
    } finally {
      setConfirmLoading(false);
    }
  };

  const openDeleteModal = (taskId, taskTitle) => {
    setConfirm({ open: true, id: taskId, title: taskTitle });
  };

  const completed = allTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const pending = allTasks.filter((t) => t.status === TASK_STATUS.PENDING).length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-sky-100"
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 60%, #f0fdfa 100%)' }}
        >
          <div className="absolute right-0 top-0 h-full w-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(14,165,233,0.1) 0%, transparent 70%)' }} />
          <div className="relative px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Task Monitoring</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading
                ? 'Loading…'
                : `${allTasks.length} task${allTasks.length !== 1 ? 's' : ''} · ${completed} completed · ${pending} pending`}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton cols={5} rows={6} />
              ) : allTasks.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
                          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600">No tasks found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Tasks will appear here once created by users.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {allTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs">
                        <span className="truncate block">{task.title}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 select-none">
                            {task.user?.name ? task.user.name[0].toUpperCase() : '?'}
                          </div>
                          <span className="text-slate-500">{task.user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.status === TASK_STATUS.COMPLETED
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openDeleteModal(task._id, task.title)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Delete task"
        message={`Are you sure you want to delete "${confirm.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirm({ open: false, id: null, title: '' })}
        loading={confirmLoading}
      />
    </AdminLayout>
  );
};

export default TaskMonitoring;
