import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import {
  setUsers,
  setLoading,
  deleteUser,
  updateUserStatus,
  updateUserRole
} from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';
import { USER_STATUS, USER_ROLES } from '../../utils/constants';
import ConfirmModal from '../../components/ConfirmModal';

const TableSkeleton = ({ cols = 5, rows = 5 }) => (
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

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, usersLoaded, isLoading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const currentId = currentUser?._id || currentUser?.id;
  const visibleUsers = users.filter(
    (u) => u._id !== currentId && u.email !== currentUser?.email
  );
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '' });
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (usersLoaded) return;
    const fetchUsers = async () => {
      dispatch(setLoading(true));
      try {
        const response = await adminService.getAllUsers();
        dispatch(setUsers(response.users || []));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUsers();
  }, [dispatch, usersLoaded]);

  const handleDeleteUser = async () => {
    setConfirmLoading(true);
    try {
      await adminService.deleteUser(confirm.id);
      dispatch(deleteUser(confirm.id));
      setConfirm({ open: false, id: null, name: '' });
    } catch (error) {
      console.error('Failed to delete user', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const openDeleteModal = (userId, userName) => {
    setConfirm({ open: true, id: userId, name: userName });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      dispatch(updateUserStatus({ _id: userId, status: newStatus }));
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      dispatch(updateUserRole({ _id: userId, role: newRole }));
    } catch (error) {
      console.error('Failed to update user role', error);
    }
  };

  const initials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div
          className="relative rounded-2xl overflow-hidden border border-violet-100"
          style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #faf5ff 100%)' }}
        >
          <div className="absolute right-0 top-0 h-full w-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
          <div className="relative px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading ? 'Loading…' : `${visibleUsers.length} user${visibleUsers.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton cols={5} rows={6} />
              ) : visibleUsers.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-3">
                          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87a4 4 0 100-8 4 4 0 000 8zm6-4a3 3 0 100-6 3 3 0 000 6zM3 16a3 3 0 100-6 3 3 0 000 6z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600">No users found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Users will appear here once registered.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {visibleUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 select-none">
                            {initials(user.name)}
                          </div>
                          <span className="font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"

                        >
                          <option value={USER_ROLES.USER}>User</option>
                          <option value={USER_ROLES.ADMIN}>Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                          <option value={USER_STATUS.ACTIVE}>Active</option>
                          <option value={USER_STATUS.INACTIVE}>Inactive</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openDeleteModal(user._id, user.name)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                          aria-label={`Delete ${user.name}`}
                          title="Delete user"
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
        title="Delete user"
        message={`Are you sure you want to delete ${confirm.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirm({ open: false, id: null, name: '' })}
        loading={confirmLoading}
      />
    </AdminLayout>
  );
};

export default UserManagement;
