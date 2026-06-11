import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setAnalytics, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const StatCard = ({ label, value, icon, colorClass, bgClass, loading }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      {loading ? (
        <span className="skeleton h-8 w-16 inline-block mt-1" />
      ) : (
        <p className={`text-3xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
      )}
    </div>
  </div>
);

const MetricRow = ({ label, value, pct, colorClass, barClass, loading }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      {loading ? (
        <span className="skeleton h-5 w-16 inline-block" />
      ) : (
        <span className={`text-sm font-semibold ${colorClass}`}>
          {pct !== undefined ? `${pct}%` : value}
        </span>
      )}
    </div>
    {pct !== undefined && !loading && (
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    )}
    {loading && <span className="skeleton h-2 w-full inline-block rounded-full" />}
  </div>
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    const fetchAnalytics = async () => {
      dispatch(setLoading(true));
      try {
        const response = await adminService.getAnalytics();
        dispatch(setAnalytics(response || {}));
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchAnalytics();
  }, [dispatch]);

  const completionPct =
    analytics.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0;

  const pendingPct =
    analytics.totalTasks > 0
      ? Math.round((analytics.pendingTasks / analytics.totalTasks) * 100)
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-emerald-100"
          style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #f0fdfa 100%)' }}
        >
          <div className="absolute right-0 top-0 h-full w-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />
          <div className="relative px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Key metrics and system performance at a glance.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={analytics.totalUsers || 0}
            loading={isLoading}
            colorClass="text-violet-600"
            bgClass="bg-violet-50"
            icon={
              <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87a4 4 0 100-8 4 4 0 000 8zm6-4a3 3 0 100-6 3 3 0 000 6zM3 16a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            }
          />
          <StatCard
            label="Total Tasks"
            value={analytics.totalTasks || 0}
            loading={isLoading}
            colorClass="text-sky-600"
            bgClass="bg-sky-50"
            icon={
              <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={analytics.completedTasks || 0}
            loading={isLoading}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            icon={
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Pending"
            value={analytics.pendingTasks || 0}
            loading={isLoading}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
            icon={
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Task Statistics</h2>
            </div>
            <div className="px-5 py-5 space-y-5">
              <MetricRow
                label="Total Tasks"
                value={analytics.totalTasks || 0}
                loading={isLoading}
                colorClass="text-slate-900"
              />
              <MetricRow
                label="Completion Rate"
                pct={completionPct}
                loading={isLoading}
                colorClass="text-emerald-600"
                barClass="bg-emerald-500"
              />
              <MetricRow
                label="Pending Rate"
                pct={pendingPct}
                loading={isLoading}
                colorClass="text-amber-600"
                barClass="bg-amber-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">User Statistics</h2>
            </div>
            <div className="px-5 py-5 space-y-5">
              <MetricRow
                label="Total Users"
                value={analytics.totalUsers || 0}
                loading={isLoading}
                colorClass="text-slate-900"
              />
              <MetricRow
                label="Active Users"
                value={analytics.activeUsers || 0}
                loading={isLoading}
                colorClass="text-violet-600"
              />
              {!isLoading && analytics.totalUsers > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Activity Rate</span>
                    <span className="text-sm font-semibold text-violet-600">
                      {Math.round(((analytics.activeUsers || 0) / analytics.totalUsers) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-400 transition-all duration-700"
                      style={{ width: `${Math.round(((analytics.activeUsers || 0) / analytics.totalUsers) * 100)}%` }}
                      role="progressbar"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
