import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  useEffect(() => {
    if (userInfo) {
      setFullName(userInfo.fullName);
      setEmail(userInfo.email);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', { fullName, email, password }, config);
      
      // Update localStorage
      const updatedUserInfo = { ...userInfo, ...data.user, token: data.token };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      toast.success('Profile Updated Successfully');
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1000); // Small delay to let toast show
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (!userInfo) return <div className="container" style={{ marginTop: '120px' }}><h2>Please log in to view profile</h2></div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>My Account</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2.5fr', gap: '40px' }}>
        {/* Profile Info Card */}
        <div className="glass" style={{ padding: '30px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
             <h2 style={{ margin: 0 }}>Profile</h2>
             {!isEditing && <button className="btn-outline" style={{ padding: '5px 15px', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>Edit</button>}
          </div>

          {isEditing ? (
            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>New Password (blank to keep)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>Save</button>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px' }} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</span>
                 <p style={{ margin: '5px 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>{userInfo?.fullName}</p>
              </div>
              <div>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</span>
                 <p style={{ margin: '5px 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>{userInfo?.email}</p>
              </div>
              <div>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</span>
                 <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{userInfo?.role?.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="glass" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '30px' }}>Transaction History</h2>
          
          {loading ? (
             <div style={{ textAlign: 'center', padding: '50px' }}>
               <p style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }} className="animate-pulse">Retrieving your legacy...</p>
             </div>
          ) : orders.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed var(--glass-border)', borderRadius: '10px' }}>
               <p style={{ color: 'var(--text-secondary)' }}>Your luxury collection begins here. No orders found.</p>
               <button className="btn-primary" style={{ marginTop: '15px' }} onClick={() => window.location.href = '/catalog'}>Explore Watches</button>
             </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Reference</th>
                    <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Amount</th>
                    <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Payment</th>
                    <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '20px 10px', fontWeight: 500 }}>LX-{order.id.toString().padStart(4, '0')}</td>
                      <td style={{ padding: '20px 10px', color: 'var(--accent-gold)', fontWeight: 600 }}>${order.totalAmount.toLocaleString()}</td>
                      <td style={{ padding: '20px 10px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                          background: order.paymentStatus === 'paid' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)',
                          color: order.paymentStatus === 'paid' ? '#2ed573' : '#ff4757',
                          border: `1px solid ${order.paymentStatus === 'paid' ? 'rgba(46, 213, 115, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`
                        }}>
                          {order.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 10px' }}>
                        <span style={{ 
                           fontSize: '0.9rem',
                           color: order.status === 'delivered' ? '#2ed573' : 'var(--text-secondary)'
                        }}>
                          {order.status === 'delivered' ? '✓ Delivered' : '• Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
