import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { Star, ArrowLeft, ShoppingBag, User } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Failed to load product details');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    toast.success(`${product.name} added to cart!`);
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existItem = cart.find((x: any) => x.product === product.id);
    if (existItem) {
      localStorage.setItem('cartItems', JSON.stringify(cart.map((x: any) => x.product === existItem.product ? { ...x, qty: x.qty + qty } : x)));
    } else {
      cart.push({
        product: product.id,
        name: product.name,
        image: JSON.parse(product.images)[0],
        price: product.price,
        qty
      });
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to write a review');
      return;
    }
    setSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`${API_URL}/api/products/${id}/reviews`, { rating, comment }, config);
      toast.success('Review submitted successfully!');
      setComment('');
      fetchProduct(); // Refresh reviews
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '120px', textAlign: 'center' }}><h2 className="glow-text">Loading Precision...</h2></div>;
  if (!product) return <div className="container" style={{ marginTop: '120px' }}><h2>Product not found</h2></div>;

  const imagesArray = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '100px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', marginBottom: '80px' }}>
        {/* Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '12px' }}>
            <img
              src={imagesArray[selectedImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {imagesArray.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {imagesArray.map((url: string, i: number) => (
                <div key={i} onClick={() => setSelectedImage(i)}
                  style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: selectedImage === i ? '2px solid var(--accent-gold)' : '2px solid transparent', opacity: selectedImage === i ? 1 : 0.6 }}>
                  <img src={url} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
            {product.brand?.name || 'Exclusive'}
          </span>
          <h1 style={{ fontSize: '3rem', margin: '10px 0', lineHeight: 1.1 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(product.rating) ? 'var(--accent-gold)' : 'none'} color="var(--accent-gold)" />
              ))}
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>{product.reviewsCount} Reviews</span>
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.8 }}>{product.description}</p>

          <div className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Price</span>
              <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-gold)' }}>${product.price}</span>
            </div>
            {product.stock > 0 ? (
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}
                  style={{ background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--glass-border)', padding: '0 20px', borderRadius: '8px', fontSize: '1.1rem' }}>
                  {[...Array(product.stock).keys()].map(x => <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                </select>
                <button onClick={() => {
                   addToCartHandler();
                   window.dispatchEvent(new Event('cartUpdated'));
                }} className="btn-primary" style={{ flex: 1, fontSize: '1.1rem' }}>
                  <ShoppingBag size={20} /> Add to Cart
                </button>
              </div>
            ) : (
               <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', textAlign: 'center' }}>
                 <span style={{ color: 'var(--danger)', fontWeight: 600, letterSpacing: '2px' }}>OUT OF STOCK</span>
                 <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This timepiece is currently unavailable for collection.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Guest Reviews</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          <div>
            {product.reviews && product.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <User size={20} color="var(--accent-gold)" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600 }}>{review.user?.fullName}</p>
                          <small style={{ color: 'var(--text-secondary)' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'var(--accent-gold)' : 'none'} color="var(--accent-gold)" />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to share your experience!</p>
            )}
          </div>

          <div>
            <div className="glass" style={{ padding: '40px' }}>
              <h3 style={{ marginBottom: '25px' }}>Write a Customer Review</h3>
              {userInfo ? (
                <form onSubmit={submitReviewHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Rating</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={5}
                      placeholder="Share your experience with this timepiece..."
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'none' }}></textarea>
                  </div>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                    Note: Only verified purchasers with a delivered order can submit reviews.
                  </p>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Please log in to write a review</p>
                  <Link to={`/login?redirect=/product/${id}`} className="btn-outline">Sign In</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
