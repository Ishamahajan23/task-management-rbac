import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/AdminLayout';
import {
  setUsers,
  setLoading,
  deleteUser,
  updateUserStatus,
} from '../../redux/admin/adminSlice';
import { adminService } from '../../services/adminService';
import { USER_STATUS } from '../../utils/constants';
import Button from '../../components/Button';
import ConfirmModal from '../../components/ConfirmModal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector(
    (state) => state.admin
  );
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '' });
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
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
  }, [dispatch]);

  const handleDeleteUser = async () => {
    setConfirmLoading(true);
    try {
      await adminService.deleteUser(confirm.id);
      dispatch(deleteUser(confirm.id));
      setConfirm({ open: false, id: null, name: '' });
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user');
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
      alert('Failed to update user status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 p-6 shadow-sm bg-linear-to-r from-emerald-50 to-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
              <p className="text-slate-600 mt-2">View, manage, and control user access across the system.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden ring-1 ring-slate-200">
          {isLoading ? (
            <div className="p-8 text-center text-slate-600">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-semibold">{user.name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          <i className="fa-solid fa-user-shield"></i>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user._id, e.target.value)}
                          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 cursor-pointer"
                        >
                          <option value={USER_STATUS.ACTIVE}>Active</option>
                          <option value={USER_STATUS.INACTIVE}>Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          className=" text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => openDeleteModal(user._id, user.name)}
                        >
                          <i className="fa-solid fa-trash"></i>
                 
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Delete User"
        message={`Are you sure you want to delete ${confirm.name}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirm({ open: false, id: null, name: '' })}
        loading={confirmLoading}
      />
    </AdminLayout>
  );
};


 
export default UserManagement;
