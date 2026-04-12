import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { toast } from 'react-toastify';
import { Trash2, Shield, User } from 'lucide-react';

const AdminUsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('${API_URL}/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/users/${id}`, config);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const toggleRoleHandler = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${API_URL}/api/users/${id}/role`, { role: newRole }, config);
      toast.success('User role updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Role update failed');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>User Management</h1>

      <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
        {loading ? (
          <p>Loading Users...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '15px' }}>NAME</th>
                <th style={{ padding: '15px' }}>EMAIL</th>
                <th style={{ padding: '15px' }}>ROLE</th>
                <th style={{ padding: '15px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 15px' }}>{user.fullName}</td>
                  <td style={{ padding: '20px 15px' }}>{user.email}</td>
                  <td style={{ padding: '20px 15px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      background: user.role === 'admin' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                      color: user.role === 'admin' ? 'var(--accent-gold)' : 'white',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {user.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '20px 15px' }}>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => toggleRoleHandler(user.id, user.role)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Set as {user.role === 'admin' ? 'User' : 'Admin'}</button>
                        <button onClick={() => deleteHandler(user.id)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                           <Trash2 size={14}/>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsersScreen;
