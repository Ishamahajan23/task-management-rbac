import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setActivityLogs, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const ACTION_STYLES = {
  LOGIN:        { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  LOGOUT:       { badge: 'bg-sky-100 text-sky-700',         dot: 'bg-sky-500' },
  CREATE_TASK:  { badge: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-500' },
  UPDATE_TASK:  { badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500' },
  DELETE_TASK:  { badge: 'bg-red-100 text-red-700',         dot: 'bg-red-500' },
};

const ACTION_FILTERS = ['All', 'LOGIN', 'LOGOUT', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'];

const ACTION_LABELS = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE_TASK: 'Create Task',
  UPDATE_TASK: 'Update Task',
  DELETE_TASK: 'Delete Task',
};

const RANGE_OPTIONS = [
  { label: 'Today',   value: 'today' },
  { label: 'Last 3 days',  value: '3' },
  { label: 'Last 7 days',  value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'All time', value: 'all' },
];

const TRUNCATE = 3;

const initials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const formatTime = (ts) =>
  new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const matchesRange = (ts, range) => {
  const date = new Date(ts);
  if (range === 'all') return true;
  if (range === 'today') {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(range));
  return date >= cutoff;
};

const SkeletonUserCard = () => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
      <span className="skeleton h-10 w-10 rounded-full inline-block shrink-0" />
      <div className="space-y-2 flex-1">
        <span className="skeleton h-4 w-32 inline-block" />
        <span className="skeleton h-3 w-48 inline-block" />
      </div>
      <span className="skeleton h-7 w-28 rounded-lg inline-block" />
    </div>
    <div className="px-5 py-4 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="skeleton h-2.5 w-2.5 rounded-full mt-1.5 inline-block shrink-0" />
          <div className="space-y-1.5 flex-1">
            <span className="skeleton h-5 w-24 rounded-full inline-block" />
            <span className="skeleton h-3 w-40 inline-block" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserCard = ({ user, logs, actionFilter }) => {
  const [range, setRange] = useState('today');
  const [expanded, setExpanded] = useState(false);

  const userName = user?.name || 'Unknown User';
  const userEmail = user?.email || '';
  const userRole = user?.role || '';

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'All' || log.action === actionFilter;
      return matchesAction && matchesRange(log.createdAt, range);
    });
  }, [logs, actionFilter, range]);

  const shownLogs = expanded ? filteredLogs : filteredLogs.slice(0, TRUNCATE);
  const hiddenCount = filteredLogs.length - TRUNCATE;

  const rangeLabel = RANGE_OPTIONS.find((o) => o.value === range)?.label ?? '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 select-none">
          {initials(userName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
          <p className="text-xs text-slate-400 truncate">{userEmail}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {userRole && (
            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {userRole}
            </span>
          )}
          <div className="relative">
            <select
              value={range}
              onChange={(e) => { setRange(e.target.value); setExpanded(false); }}
              className="rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 appearance-none"
            >
              {RANGE_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {filteredLogs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">
            No activity for {rangeLabel.toLowerCase()}.
          </p>
        ) : (
          <>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-100" />
              <div className="space-y-4">
                {shownLogs.map((log, i) => {
                  const style = ACTION_STYLES[log.action] || { badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' };
                  return (
                    <div key={log._id || i} className="flex items-start gap-4 relative">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-white ${style.dot}`} />
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                          {log.taskId?.title && (
                            <span className="text-xs text-slate-500 truncate max-w-[200px]">
                              {log.taskId.title}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {filteredLogs.length > TRUNCATE && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer focus-visible:outline-none"
              >
                {expanded ? (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    Show less
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    Show {hiddenCount} more
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { activityLogs, isLoading } = useSelector((state) => state.admin);
  const [actionFilter, setActionFilter] = useState('All');
  const [search, setSearch] = useState('');

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

  const grouped = useMemo(() => {
    const filtered = activityLogs.filter((log) =>
      !search || log.userId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const map = {};
    filtered.forEach((log) => {
      const key = log.userId?._id || 'unknown';
      if (!map[key]) map[key] = { user: log.userId, logs: [] };
      map[key].logs.push(log);
    });

    return Object.values(map).sort((a, b) => {
      const aLatest = new Date(a.logs[0]?.createdAt ?? 0);
      const bLatest = new Date(b.logs[0]?.createdAt ?? 0);
      return bLatest - aLatest;
    });
  }, [activityLogs, search]);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-slate-200"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 60%, #f8fafc 100%)' }}
        >
          <div
            className="absolute right-0 top-0 h-full w-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
          />
          <div className="relative px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading ? 'Loading…' : `${grouped.length} user${grouped.length !== 1 ? 's' : ''} with activity`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by user name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full sm:w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by action">
            {ACTION_FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={actionFilter === f}
                onClick={() => setActionFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  actionFilter === f
                    ? 'bg-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f === 'All' ? 'All Actions' : ACTION_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonUserCard key={i} />)}
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
              <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No logs found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(({ user, logs }) => (
              <UserCard
                key={user?._id || 'unknown'}
                user={user}
                logs={logs}
                actionFilter={actionFilter}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
