import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  const fetchWishlist = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('${API_URL}/api/wishlist', config);
      setWishlistItems(data.items || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Failed to load wishlist');
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchWishlist();
    }
  }, []);

  const removeFromWishlistHandler = async (productId: number) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, config);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (!userInfo) return (
    <div className="container" style={{ marginTop: '120px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Wishlist</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Please log in to see your saved items.</p>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <Heart fill="var(--accent-gold)" color="var(--accent-gold)" size={32} />
        <h1 style={{ fontSize: '3rem', margin: 0 }}>My Wishlist</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--accent-gold)' }}>Loading your favorites...</div>
      ) : (
        <>
          {wishlistItems.length === 0 ? (
            <div className="glass" style={{ padding: '80px', textAlign: 'center' }}>
              <Heart size={48} color="var(--glass-border)" style={{ marginBottom: '20px' }} />
              <h3>Your wishlist is empty</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Explore our collection and save the timepieces you love.</p>
              <a href="/catalog" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Collection</a>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '30px' 
            }}>
              {wishlistItems.map(item => (
                <div key={item.id} style={{ position: 'relative' }}>
                  <ProductCard product={item.product} />
                  <button 
                    onClick={() => removeFromWishlistHandler(item.productId)}
                    style={{ 
                      position: 'absolute', 
                      top: '15px', 
                      right: '15px', 
                      background: 'rgba(255, 0, 0, 0.2)', 
                      border: '1px solid rgba(255, 0, 0, 0.3)', 
                      color: '#ff4d4d',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: 10,
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WishlistScreen;
