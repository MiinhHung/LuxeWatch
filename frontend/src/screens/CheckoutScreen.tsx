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
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const checkCouponHandler = async () => {
    if (!couponCode) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/coupons/validate', { code: couponCode }, config);
      setDiscount(data.discountAmount);
      setIsCouponApplied(true);
      toast.success(`Coupon applied! You saved $${data.discountAmount}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setDiscount(0);
      setIsCouponApplied(false);
    }
  };

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

      const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
      const totalAmount = subtotal - discount;

      const { data: orderData } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress: { address, city, postalCode },
          totalAmount: subtotal, // Send subtotal, server will re-calculate based on coupon
          paymentMethod,
          couponCode: isCouponApplied ? couponCode : null
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
          amount: totalAmount, // Use discounted amount
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

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

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

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-gold)', fontWeight: 600 }}>Promo Code</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. WELCOME)"
                disabled={isCouponApplied}
                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
              />
              <button 
                type="button" 
                onClick={checkCouponHandler}
                className="btn-outline"
                disabled={isCouponApplied || !couponCode}
                style={{ padding: '0 15px', fontSize: '0.8rem' }}
              >
                {isCouponApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {isCouponApplied && (
              <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '5px' }}>
                ✓ Coupon "{couponCode}" applied successfully!
              </p>
            )}
          </div>
        </div>

        <div className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
           <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              {isCouponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Discount ({couponCode})</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total Amount</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-gold)' }}>${subtotal - discount}</span>
              </div>
           </div>

           <div style={{ marginTop: '30px' }}>
             <h3 style={{ marginBottom: '15px', fontSize: '1rem' }}>Payment Method</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  onClick={() => setPaymentMethod('vnpay')}
                  style={{ 
                    padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                    border: paymentMethod === 'vnpay' ? '1px solid var(--accent-gold)' : '1px solid var(--glass-border)',
                    background: paymentMethod === 'vnpay' ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
                  }}>
                  💳 VNPAY Online
                </div>
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  style={{ 
                    padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                    border: paymentMethod === 'cod' ? '1px solid var(--accent-gold)' : '1px solid var(--glass-border)',
                    background: paymentMethod === 'cod' ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
                  }}>
                  💵 Cash on Delivery
                </div>
             </div>
           </div>

           <div style={{ marginTop: 'auto' }}>
             <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
              {loading ? 'Processing...' : 'Complete Acquisition'}
             </button>
           </div>
        </div>
      </form>
    </div>
  );

};

export default CheckoutScreen;
