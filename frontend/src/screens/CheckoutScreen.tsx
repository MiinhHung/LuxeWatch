import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutScreen = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vnpay'); // vnpay, cod

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const placeOrderHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
      if (!userInfo) {
        toast.error('Please login to place an order');
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const orderItems = cartItems.map(item => ({
        productId: item.product,
        qty: item.qty,
        price: item.price
      }));

      const totalAmount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

      const { data: orderData } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress: { address, city, postalCode },
          totalAmount,
          paymentMethod
        },
        config
      );

      if (paymentMethod === 'cod') {
         toast.success('Order placed successfully! Cash on delivery selected.');
         localStorage.removeItem('cartItems');
         window.dispatchEvent(new Event('cartUpdated'));
         window.location.href = `/payment-result?orderId=${orderData.id}&vnp_ResponseCode=00&method=cod`;
         return;
      }

      toast.success('Order generated! Redirecting to secure VNPAY checkout...');

      const { data: payData } = await axios.post(
        'http://localhost:5000/api/payments/create_payment_url',
        {
          orderId: orderData.id,
          amount: totalAmount,
          bankCode: '',
          language: 'vn'
        },
        config
      );

      // Redirect to VNPAY
      if (payData.url) {
        localStorage.removeItem('cartItems'); // clear cart
        window.dispatchEvent(new Event('cartUpdated'));
        window.location.href = payData.url;
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Checkout failed. Please login first.');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', maxWidth: '800px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Finalize Acquisition</h1>

      <form onSubmit={placeOrderHandler} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Delivery Destination</h2>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)}
              required
              placeholder="e.g. 123 Luxury Ave"
              style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>City</label>
            <input 
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)}
              required
              placeholder="e.g. Hanoi"
              style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Postal Code</label>
            <input 
              type="text" 
              value={postalCode} 
              onChange={e => setPostalCode(e.target.value)}
              required
              style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
           <h2 style={{ marginBottom: '20px' }}>Payment Selection</h2>
           
           <div 
             onClick={() => setPaymentMethod('vnpay')}
             style={{ 
               padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s',
               border: paymentMethod === 'vnpay' ? '2px solid var(--accent-gold)' : '1px solid var(--glass-border)',
               background: paymentMethod === 'vnpay' ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
             }}>
             <h4 style={{ margin: 0, color: paymentMethod === 'vnpay' ? 'var(--accent-gold)' : 'white' }}>💳 Online E-banking (VNPAY)</h4>
             <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure instant payment via bank transfer or QR code.</p>
           </div>

           <div 
             onClick={() => setPaymentMethod('cod')}
             style={{ 
               padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s',
               border: paymentMethod === 'cod' ? '2px solid var(--accent-gold)' : '1px solid var(--glass-border)',
               background: paymentMethod === 'cod' ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
             }}>
             <h4 style={{ margin: 0, color: paymentMethod === 'cod' ? 'var(--accent-gold)' : 'white' }}>💵 Cash on Delivery (COD)</h4>
             <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay only when you receive and inspect your timepiece.</p>
           </div>

           <div style={{ marginTop: 'auto' }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                By clicking "Complete Acquisition", you agree to our luxury service terms.
             </p>
             <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : 'Complete Acquisition'}
             </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutScreen;
