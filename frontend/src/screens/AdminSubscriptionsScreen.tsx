import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Clock, Download } from 'lucide-react';

const AdminSubscriptionsScreen = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  const fetchSubscriptions = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/subscriptions', config);
      setSubscriptions(data.subscriptions || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Failed to load subscriptions');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const exportCSV = () => {
     const headers = ['Email', 'Date Subscribed'];
     const rows = subscriptions.map(sub => [sub.email, new Date(sub.createdAt).toLocaleString()]);
     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.setAttribute("href", url);
     link.setAttribute("download", "luxetime_subscriptions.csv");
     link.click();
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Inner Circle</h1>
        <button className="btn-outline" onClick={exportCSV} disabled={subscriptions.length === 0}>
           <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="glass" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: 'var(--accent-gold)' }}>
           <Mail size={24} />
           <h2 style={{ margin: 0 }}>Subscribers ({subscriptions.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
             <p className="animate-pulse" style={{ color: 'var(--accent-gold)' }}>Opening the vault...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '50px' }}>No members in the inner circle yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Subscriber Email</th>
                  <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                    <td style={{ padding: '20px 10px', fontSize: '1.1rem', fontWeight: 500 }}>{sub.email}</td>
                    <td style={{ padding: '20px 10px', color: 'var(--text-secondary)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} />
                          {new Date(sub.createdAt).toLocaleString()}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionsScreen;
