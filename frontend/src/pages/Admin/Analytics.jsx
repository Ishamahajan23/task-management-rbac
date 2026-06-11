import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setAnalytics, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      dispatch(setLoading(true));
      try {
        const response = await adminService.getAnalytics();
        dispatch(setAnalytics(response|| {}));
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAnalytics();
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-slate-900"> Analytics</h1>
            </div>

        {isLoading ? (
          <p className="text-gray-600">Loading analytics...</p>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 ">
            <div className="bg-white p-6 rounded-xl shadow flex items-center justify-around gap-4">
                <div className="">
                   <h3 className="text-gray-600 text-sm font-medium">
                            Total Users
                        </h3>
                        <p className="text-6xl font-bold text-yellow-600 mt-2">
                            {analytics.totalUsers || 0}
                        </p>
                </div>
             <div className="flex items-center gap-4">

              <i class="fa-solid fa-users text-4xl"></i>

                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow flex items-center justify-around gap-4">
                <div className="">

              <h3 className="text-gray-600 text-sm font-medium">
                Total Tasks
              </h3>
              <p className="text-6xl font-bold text-sky-600 mt-2">
                {analytics.totalTasks || 0}
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
                {analytics.completedTasks || 0}
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
                {analytics.pendingTasks || 0}
              </p>
                </div>
                <div className="flex items-center gap-4">

                <i class="fa-regular fa-hourglass-half text-4xl"></i>
                </div>
            </div>
           
          </div>
        
            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Task Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <span className="text-gray-700">Total Tasks</span>
                    <span className="font-bold">
                      {analytics.totalTasks || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <span className="text-gray-700">
                      Completion Rate
                    </span>
                    <span className="font-bold text-green-600">
                      {analytics.totalTasks > 0
                        ? Math.round(
                            (analytics.completedTasks /
                              analytics.totalTasks) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <span className="text-gray-700">Pending Rate</span>
                    <span className="font-bold text-yellow-600">
                      {analytics.totalTasks > 0
                        ? Math.round(
                            (analytics.pendingTasks /
                              analytics.totalTasks) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  User Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <span className="text-gray-700">Total Users</span>
                    <span className="font-bold">
                      {analytics.totalUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <span className="text-gray-700">Active Users</span>
                    <span className="font-bold text-indigo-600">
                      {analytics.totalUsers || 0}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics;
