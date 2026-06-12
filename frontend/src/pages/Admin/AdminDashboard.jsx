import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setAnalytics, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const ACCENT_BAR = {
  violet: 'bg-gradient-to-r from-violet-400 to-purple-500',
  sky: 'bg-gradient-to-r from-sky-400 to-blue-500',
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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, analyticsLoaded, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (analyticsLoaded) return;
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
  }, [dispatch, analyticsLoaded]);

  const completionPct =
    analytics.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-violet-100"
          style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #faf5ff 100%)' }}
        >
          <div className="absolute right-0 top-0 h-full w-56 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
          <div className="relative px-6 py-6 sm:px-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/50 bg-violet-100/60 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-dot" />
                Admin Panel
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">System-wide overview of users and tasks.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={analytics.totalUsers || 0}
            subtitle="registered accounts"
            loading={isLoading}
            colorClass="text-violet-600"
            bgClass="bg-violet-50"
            barClass={ACCENT_BAR.violet}
            icon={
              <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87a4 4 0 100-8 4 4 0 000 8zm6-4a3 3 0 100-6 3 3 0 000 6zM3 16a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            }
          />
          <StatCard
            label="Total Tasks"
            value={analytics.totalTasks || 0}
            subtitle="across all users"
            loading={isLoading}
            colorClass="text-sky-600"
            bgClass="bg-sky-50"
            barClass={ACCENT_BAR.sky}
            icon={
              <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={analytics.completedTasks || 0}
            subtitle={`${completionPct}% completion rate`}
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
            value={analytics.pendingTasks || 0}
            subtitle={analytics.pendingTasks > 0 ? 'need attention' : 'all done!'}
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

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">System Overview</h2>
            <span className="text-xs text-slate-400">Live data</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-slate-700">Active Users</span>
                  <p className="text-xs text-slate-400">Currently enabled accounts</p>
                </div>
              </div>
              {isLoading ? (
                <span className="skeleton h-6 w-12 inline-block" />
              ) : (
                <span className="text-lg font-bold text-slate-900">{analytics.totalUsers || 0}</span>
              )}
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-slate-700">Completion Rate</span>
                    <p className="text-xs text-slate-400">Completed vs total tasks</p>
                  </div>
                </div>
                {isLoading ? (
                  <span className="skeleton h-6 w-12 inline-block" />
                ) : (
                  <span className="text-lg font-bold text-emerald-600">{completionPct}%</span>
                )}
              </div>
              {!isLoading && (
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden ml-11">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #5FB56A, #169179)' }}
                    role="progressbar"
                    aria-valuenow={completionPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
