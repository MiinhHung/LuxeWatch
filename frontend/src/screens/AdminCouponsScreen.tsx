import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { toast } from 'react-toastify';
import { Ticket, Trash2, Plus, Clock } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discountAmount: string;
  isActive: boolean;
  createdAt: string;
}

const AdminCouponsScreen = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  const fetchCoupons = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('${API_URL}/api/coupons', config);
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('${API_URL}/api/coupons', { code, discountAmount }, config);
      toast.success('Coupon created successfully');
      setCode('');
      setDiscountAmount('');
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Creation failed');
    }
  };

  const deleteHandler = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/coupons/${id}`, config);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>Coupon Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Create Form */}
        <div className="glass" style={{ padding: '30px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={24} color="var(--accent-gold)" /> Create Coupon
          </h2>
          <form onSubmit={createHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Code</label>
              <input 
                type="text" 
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER2026"
                required
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Discount Amount ($)</label>
              <input 
                type="number" 
                value={discountAmount}
                onChange={e => setDiscountAmount(e.target.value)}
                placeholder="e.g. 100"
                required
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Create New Coupon</button>
          </form>
        </div>

        {/* Coupon List */}
        <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
          {loading ? (
            <p>Loading Coupons...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '15px' }}>CODE</th>
                  <th style={{ padding: '15px' }}>DISCOUNT</th>
                  <th style={{ padding: '15px' }}>STATUS</th>
                  <th style={{ padding: '15px' }}>CREATED</th>
                  <th style={{ padding: '15px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '20px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Ticket size={18} color="var(--accent-gold)" />
                        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{coupon.code}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 15px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      ${coupon.discountAmount}
                    </td>
                    <td style={{ padding: '20px 15px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
                        background: coupon.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: coupon.isActive ? '#4ade80' : '#ef4444',
                        border: `1px solid ${coupon.isActive ? 'rgba(74,222,128,0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                      }}>
                        {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={14} /> {new Date(coupon.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '20px 15px' }}>
                      <button 
                        onClick={() => deleteHandler(coupon.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCouponsScreen;
