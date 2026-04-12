import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ProductProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string;
    rating: number;
    brand: { name: string };
  };
}

const ProductCard = ({ product }: ProductProps) => {
  // Parsing the images string containing JSON
  const imagesArray = product.images ? JSON.parse(product.images) : [];
  const imageUrl = imagesArray.length > 0 ? imagesArray[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', display: 'block', position: 'relative' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ 
            width: '100%', 
            height: '250px', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease' 
          }} 
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <button 
          onClick={async (e) => {
            e.preventDefault();
            const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
            if (!userInfo) return toast.error('Please login to save favorites');
            try {
              const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
              await axios.post('http://localhost:5000/api/wishlist', { productId: product.id }, config);
              toast.success('Added to wishlist!');
            } catch (err) {
              toast.error('Already in wishlist or failed');
            }
          }}
          style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            background: 'rgba(0,0,0,0.4)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '8px', 
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
          }}
        >
          <Heart size={18} color="white" />
        </button>
      </Link>
      
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.brand?.name || 'Luxury'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)' }}>
            <Star size={14} fill="var(--accent-gold)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 500 }}>{product.name}</h3>
        </Link>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            ${product.price}
          </span>
          <Link to={`/product/${product.id}`}>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer' }}>
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
