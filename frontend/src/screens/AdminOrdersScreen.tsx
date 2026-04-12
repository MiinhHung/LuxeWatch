import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  stock: number;
}


interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  user: { fullName: string };
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  orderItems: OrderItem[];
}


const AdminOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      if (!userInfoString) return;
      const userInfo = JSON.parse(userInfoString);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const deliverHandler = async (id: number) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
      toast.success('Order marked as delivered');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>Order Management</h1>

      <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
        {loading ? (
          <p>Loading Orders...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>USER</th>
                <th style={{ padding: '15px' }}>DATE</th>
                <th style={{ padding: '15px' }}>TOTAL</th>
                <th style={{ padding: '15px' }}>PAID</th>
                <th style={{ padding: '15px' }}>STATUS</th>
                <th style={{ padding: '15px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const outOfStockItems = order.orderItems.filter((item) => item.product.stock <= 0);
                const isLowStock = outOfStockItems.length > 0;


                return (
                  <tr key={order.id} style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: isLowStock ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                    transition: 'background 0.3s'
                  }}>
                    <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>
                      #{order.id}
                      {isLowStock && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <AlertTriangle size={12}/> Out of Stock
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '20px 15px' }}>{order.user?.fullName}</td>
                    <td style={{ padding: '20px 15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '20px 15px', fontWeight: 600 }}>${order.totalAmount}</td>
                    <td style={{ padding: '20px 15px' }}>
                      {order.paymentStatus === 'paid' ? (
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={14}/> Paid</span>
                      ) : (
                        <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14}/> Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '20px 15px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        background: order.status === 'delivered' ? 'rgba(74,222,128,0.1)' : 'rgba(255,165,0,0.1)',
                        color: order.status === 'delivered' ? '#4ade80' : '#ffa500'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px 15px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {order.status !== 'delivered' && (
                          <button 
                            onClick={() => deliverHandler(order.id)} 
                            className="btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            disabled={isLowStock}
                            title={isLowStock ? "Cannot deliver: some items are out of stock" : ""}
                          >
                            <Truck size={14}/> {isLowStock ? 'Stock Needed' : 'Mark Delivered'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersScreen;
