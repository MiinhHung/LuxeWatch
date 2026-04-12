import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('${API_URL}/api/users/stats', config);
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container" style={{ marginTop: '120px' }}>Loading Stats...</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>Business Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <DollarSign color="var(--accent-gold)" size={32} />
          <h3 style={{ color: 'var(--text-secondary)', margin: '15px 0 5px' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <ShoppingCart color="#4ade80" size={32} />
          <h3 style={{ color: 'var(--text-secondary)', margin: '15px 0 5px' }}>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalOrders}</p>
        </div>
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <Users color="#60a5fa" size={32} />
          <h3 style={{ color: 'var(--text-secondary)', margin: '15px 0 5px' }}>Registered Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalUsers}</p>
        </div>
        <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
          <TrendingUp color="#f472b6" size={32} />
          <h3 style={{ color: 'var(--text-secondary)', margin: '15px 0 5px' }}>Total Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalProducts}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="glass" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Recent Orders</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '10px 0' }}>User</th>
                <th style={{ padding: '10px 0' }}>Date</th>
                <th style={{ padding: '10px 0' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 0' }}>{order.user.fullName}</td>
                  <td style={{ padding: '15px 0' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '15px 0', color: 'var(--accent-gold)' }}>${order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Orders By Status</h2>
          {stats.ordersByStatus.map((status: any) => (
             <div key={status.status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
               <span style={{ textTransform: 'capitalize' }}>{status.status}</span>
               <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>{status._count.status}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
