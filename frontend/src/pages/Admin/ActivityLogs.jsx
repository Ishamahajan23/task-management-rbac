import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import { setActivityLogs, setLoading } from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';

const ACTION_STYLES = {
  LOGIN:       { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  LOGOUT:      { badge: 'bg-sky-50 text-sky-700 ring-sky-600/20',             dot: 'bg-sky-500' },
  CREATE_TASK: { badge: 'bg-violet-50 text-violet-700 ring-violet-600/20',    dot: 'bg-violet-500' },
  UPDATE_TASK: { badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',       dot: 'bg-amber-500' },
  DELETE_TASK: { badge: 'bg-red-50 text-red-700 ring-red-600/20',             dot: 'bg-red-500' },
};

const DEFAULT_STYLE = { badge: 'bg-slate-50 text-slate-700 ring-slate-600/20', dot: 'bg-slate-400' };

const ACTION_FILTERS = ['All', 'LOGIN', 'LOGOUT', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'];

const ACTION_LABELS = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE_TASK: 'Task Created',
  UPDATE_TASK: 'Task Updated',
  DELETE_TASK: 'Task Deleted',
};

const RANGE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 3 days', value: '3' },
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'All time', value: 'all' },
];

const TRUNCATE = 3;

const initials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTime = (ts) => {
  const date = new Date(ts);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  if (isSameDay(date, now)) return `Today, ${time}`;
  if (isSameDay(date, yesterday)) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}, ${time}`;
};

const matchesRange = (ts, range) => {
  if (range === 'all') return true;
  const date = new Date(ts);
  if (range === 'today') return isSameDay(date, new Date());
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(range));
  return date >= cutoff;
};

const logUser = (log) => {
  if (log.userId) {
    return {
      id: log.userId._id,
      name: log.userId.name || 'Unknown User',
      email: log.userId.email || '',
      role: log.userId.role || '',
      deleted: false,
    };
  }
  return {
    id: `deleted:${log.userEmail || log.userName || 'unknown'}`,
    name: log.userName || 'Deleted User',
    email: log.userEmail || '',
    role: '',
    deleted: true,
  };
};

const SkeletonUserCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
      <span className="skeleton h-11 w-11 rounded-full inline-block shrink-0" />
      <div className="space-y-2 flex-1">
        <span className="skeleton h-4 w-32 inline-block" />
        <span className="skeleton h-3 w-48 inline-block" />
      </div>
      <span className="skeleton h-8 w-32 rounded-lg inline-block" />
    </div>
    <div className="px-6 py-5 space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <span className="skeleton h-2.5 w-2.5 rounded-full mt-1.5 inline-block shrink-0" />
          <div className="space-y-1.5 flex-1">
            <span className="skeleton h-5 w-28 rounded-full inline-block" />
            <span className="skeleton h-3 w-44 inline-block" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserCard = ({ user, logs, actionFilter }) => {
  const [range, setRange] = useState('today');
  const [expanded, setExpanded] = useState(false);

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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold select-none ${
            user.deleted
              ? 'bg-slate-100 text-slate-400'
              : 'text-white'
          }`}
          style={user.deleted ? {} : { background: 'linear-gradient(135deg, #5FB56A 0%, #169179 100%)' }}
        >
          {initials(user.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[15px] font-semibold text-slate-900 truncate">{user.name}</p>
            {user.role && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                {user.role}
              </span>
            )}
            {user.deleted && (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 ring-1 ring-inset ring-red-200">
                Account deleted
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {user.email || 'No email on record'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {logs.length} total
          </span>
          <div className="relative">
            <select
              value={range}
              onChange={(e) => { setRange(e.target.value); setExpanded(false); }}
              aria-label={`Date range for ${user.name}`}
              className="rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-medium text-slate-700 cursor-pointer transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 appearance-none shadow-sm"
            >
              {RANGE_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center py-4">
            <p className="text-sm text-slate-500">No activity for {rangeLabel.toLowerCase()}</p>
            <p className="text-xs text-slate-400 mt-0.5">Try a wider date range from the dropdown.</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
              <div className="space-y-5">
                {shownLogs.map((log, i) => {
                  const style = ACTION_STYLES[log.action] || DEFAULT_STYLE;
                  return (
                    <div key={log._id || i} className="flex items-start gap-4 relative">
                      <div className={`mt-[5px] h-2.5 w-2.5 rounded-full shrink-0 ring-4 ring-white ${style.dot}`} />
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.badge}`}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                          {log.taskId?.title && (
                            <span className="text-xs text-slate-500 truncate max-w-[220px]" title={log.taskId.title}>
                              {log.taskId.title}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 tabular-nums shrink-0">
                          {formatTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {filteredLogs.length > TRUNCATE && (
              <div className="mt-5 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md px-1"
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
                      Show {hiddenCount} more {hiddenCount === 1 ? 'activity' : 'activities'}
                    </>
                  )}
                </button>
              </div>
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
    const map = {};
    activityLogs.forEach((log) => {
      const user = logUser(log);
      if (search && !user.name.toLowerCase().includes(search.toLowerCase())) return;
      if (!map[user.id]) map[user.id] = { user, logs: [] };
      map[user.id].logs.push(log);
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
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(22,145,121,0.25) 0%, transparent 70%)' }}
          />
          <div className="relative px-6 py-6 sm:px-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
              <p className="text-sm text-slate-400 mt-1">
                Full audit trail of user sessions and task activity.
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {isLoading ? '—' : activityLogs.length}
                </p>
                <p className="text-xs text-slate-400">Total events</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {isLoading ? '—' : grouped.length}
                </p>
                <p className="text-xs text-slate-400">Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by user name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full lg:w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 shadow-sm"
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
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
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
                key={user.id}
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
