import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useApi';
import {
  FiUsers, FiSearch, FiEdit2, FiTrash2, FiX, FiCheck,
  FiChevronLeft, FiChevronRight, FiShield, FiUser, FiBookOpen,
  FiMail, FiCalendar, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ROLES = ['student', 'teacher', 'admin'];
const ROLE_COLORS = {
  admin: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: FiShield },
  teacher: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: FiBookOpen },
  student: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: FiUser },
};

const AdminUsers = () => {
  const { users, loading, error, updateUser, deleteUser, setUsers } = useUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Filter users
  const filtered = (users || []).filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Role stats
  const roleCounts = {
    admin: (users || []).filter(u => u.role === 'admin').length,
    teacher: (users || []).filter(u => u.role === 'teacher').length,
    student: (users || []).filter(u => u.role === 'student').length,
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const saveEdit = async (userId) => {
    try {
      await updateUser.mutate({ id: userId, ...editForm });
      // Update local state
      setUsers(prev => {
        if (Array.isArray(prev)) {
          return prev.map(u => u._id === userId ? { ...u, ...editForm } : u);
        }
        if (prev?.users) {
          return { ...prev, users: prev.users.map(u => u._id === userId ? { ...u, ...editForm } : u) };
        }
        return prev;
      });
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const confirmDelete = async (userId) => {
    try {
      await deleteUser.mutate(userId);
      setUsers(prev => {
        if (Array.isArray(prev)) return prev.filter(u => u._id !== userId);
        if (prev?.users) return { ...prev, users: prev.users.filter(u => u._id !== userId) };
        return prev;
      });
      setDeleteConfirm(null);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-red-400 font-medium">Error loading users</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)] w-full">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-500 mt-1">{(users || []).length} total users in the system</p>
        </div>

        {/* Role Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map(role => {
            const rc = ROLE_COLORS[role];
            const Icon = rc.icon;
            return (
              <div key={role} className={`bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer ${roleFilter === role ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg ${rc.bg} ${rc.border} border`}>
                      <Icon className={`h-5 w-5 ${rc.text}`} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{roleCounts[role]}</p>
                      <p className="text-gray-500 text-sm capitalize">{role}s</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${rc.bg} ${rc.text} ${rc.border} border`}>
                    {((roleCounts[role] / (users || []).length) * 100 || 0).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setRoleFilter('all'); setSearch(''); setPage(1); }}
                className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg border border-gray-700 hover:text-white hover:border-gray-600 transition-all text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <FiUsers className="h-12 w-12 mx-auto text-gray-700 mb-3" />
                      <p className="text-gray-500">No users found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map(user => {
                    const rc = ROLE_COLORS[user.role] || ROLE_COLORS.student;
                    const RoleIcon = rc.icon;
                    const isEditing = editingUser === user._id;

                    return (
                      <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        {/* Name */}
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm w-full max-w-[200px]"
                            />
                          ) : (
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                                <span className="text-purple-400 font-semibold text-sm">
                                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <span className="text-white font-medium text-sm">{user.name}</span>
                            </div>
                          )}
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              value={editForm.email}
                              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm w-full max-w-[250px]"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">{user.email}</span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <select
                              value={editForm.role}
                              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm"
                            >
                              {ROLES.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${rc.bg} ${rc.text} ${rc.border} border`}>
                              <RoleIcon className="mr-1.5 h-3 w-3" />
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-6">
                          <span className="text-gray-500 text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'active' || !user.status
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : user.status === 'suspended'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'active' || !user.status ? 'bg-green-400' : user.status === 'suspended' ? 'bg-red-400' : 'bg-yellow-400'
                              }`}></span>
                            {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(user._id)}
                                  disabled={updateUser.loading}
                                  className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Save"
                                >
                                  <FiCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </>
                            ) : deleteConfirm === user._id ? (
                              <>
                                <span className="text-xs text-red-400 mr-2">Delete?</span>
                                <button
                                  onClick={() => confirmDelete(user._id)}
                                  disabled={deleteUser.loading}
                                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Confirm Delete"
                                >
                                  <FiCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(user)}
                                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                  title="Edit User"
                                >
                                  <FiEdit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(user._id)}
                                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} users
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;