import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setActivityLogs, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { activityLogs, isLoading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    const fetchLogs = async () => {
      dispatch(setLoading(true));
      try {
        const response = await adminService.getActivityLogs();
        dispatch(setActivityLogs(response.logs || []));
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLogs();
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-slate-900"> Activity Logs</h1>
            </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <p className="p-6 text-gray-600">Loading logs...</p>
          ) : activityLogs.length === 0 ? (
            <p className="p-6 text-gray-600">No activity logs found</p>
          ) : (
        <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {activityLogs.map((log, index) => (
                  <tr
                    key={log._id || index}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-800">
                      {log.userId?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          log.action === 'LOGIN'
                            ? 'bg-green-100 text-green-800'
                            : log.action === 'LOGOUT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(log.createdAt.split("T").join(" ")).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
