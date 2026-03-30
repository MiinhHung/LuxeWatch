import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const removeFromCart = (id: number) => {
    const newItems = cartItems.filter(x => x.product !== id);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="container animate-slide-up" style={{ marginTop: '120px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-secondary)' }}>Your cart is empty</h2>
          <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
            Go Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div>
            {cartItems.map((item) => (
              <div key={item.product} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', marginBottom: '20px' }}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                  </Link>
                  <span style={{ color: 'var(--accent-gold)' }}>${item.price}</span>
                </div>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Qty: {item.qty}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '10px' }}
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: '30px', height: 'fit-content' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
              <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 600 }}>
              <span>Total</span>
              <span className="glow-text" style={{ color: 'var(--accent-gold)' }}>
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </span>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={checkoutHandler}
            >
              Proceed To Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
