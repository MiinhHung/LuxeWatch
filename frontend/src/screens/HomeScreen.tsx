import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const HomeScreen = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.9)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer'
          }}
        >
          <div className="glass" style={{ width: '90%', maxWidth: '1000px', padding: '10px', borderRadius: '15px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/wgwQT6aJd5s?autoplay=1"
                title="Luxury Watch Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <section
        className="animate-fade-in"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '80px'
        }}
      >
        {/* Video Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2, overflow: 'hidden', pointerEvents: 'none' }}>
           <iframe 
             src="https://www.youtube.com/embed/wgwQT6aJd5s?autoplay=1&mute=1&loop=1&playlist=bMeiywxAtLU,0YvWawNKPcc&controls=0&rel=0" 
             style={{ position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '100vh', transform: 'translate(-50%, -50%) scale(1.5)' }} 
             frameBorder="0" allow="autoplay; encrypted-media"></iframe>
        </div>
        {/* Dark Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4))', zIndex: -1 }}></div>

        <div className="container animate-slide-up delay-100" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="glow-text" style={{ fontSize: '5rem', marginBottom: '20px', lineHeight: 1.1 }}>
            Elegance <br />in Time
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '20px' }}>
            Discover our curated collection of luxury timepieces engineered for precision and designed for prestige. Make a statement today.
          </p>
          <div style={{ marginBottom: '40px', borderLeft: '2px solid var(--accent-gold)', paddingLeft: '15px' }}>
             <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
               Exclusive Offer
             </p>
             <p style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>
               Use code <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>WELCOME</span> for $500 off your acquisition
             </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <button className="btn-primary" onClick={() => window.location.href = '/catalog'}>
              Explore Collection
            </button>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); const val = (e.currentTarget.elements[0] as HTMLInputElement).value; window.location.href = `/catalog?keyword=${val}`; }}
            style={{ maxWidth: '400px', position: 'relative' }}
          >
            <input
              type="text"
              placeholder="Search for your dream watch..."
              style={{ width: '100%', padding: '15px 15px 15px 45px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '30px', color: 'white' }}
            />
            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }}>🔍</div>
          </form>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Featured</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>New Arrivals</h2>
          </div>
          <a href="/catalog" style={{ borderBottom: '1px solid var(--accent-gold)', paddingBottom: '4px', color: 'var(--accent-gold)' }}>View All</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--accent-gold)' }}>Loading signature pieces...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* About Shop / Heritage Section */}
      <section style={{ background: 'var(--bg-secondary)', padding: '100px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
             <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem' }}>Since 1994</span>
             <h2 style={{ fontSize: '3.5rem', margin: '20px 0', lineHeight: 1.1 }}>The Heritage of <br/> LuxeTime</h2>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '30px' }}>
               For over three decades, LuxeTime has been the sanctuary for those who seek more than just a timepiece. We curate precision, we celebrate heritage, and we deliver prestige to the wrists of visionaries worldwide.
             </p>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                   <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Craftsmanship</h4>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Every watch is inspected by our master horologists to ensure absolute mechanical perfection.</p>
                </div>
                <div>
                   <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Authenticity</h4>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We guarantee 100% authenticity for every piece, backed by our lifetime provenance certificate.</p>
                </div>
             </div>
          </div>
          <div style={{ position: 'relative' }}>
             <div className="glass" style={{ padding: '10px', borderRadius: '20px', transform: 'rotate(-3deg)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1495856458515-0637185db551?auto=format&fit=crop&q=80&w=800" 
                  alt="Watchmaking" 
                  style={{ width: '100%', borderRadius: '15px', display: 'block' }}
                />
             </div>
             <div className="glass-card" style={{ position: 'absolute', bottom: '-40px', right: '-20px', padding: '30px', maxWidth: '250px', transform: 'rotate(2deg)' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontStyle: 'italic', margin: 0 }}>"Time is the ultimate luxury."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '60px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Customer Reviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Review 1: Ronaldo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              background: '#C2A368', 
              padding: '30px', 
              borderRadius: '8px', 
              position: 'relative',
              marginBottom: '30px',
              color: '#222',
              textAlign: 'left',
              minHeight: '160px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                "LuxeTime is my go-to place for high-end timepieces. The level of service and the exclusivity of their collection is truly unmatched. A perfect experience every time."
              </p>
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '15px solid #C2A368'
              }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=150&h=150" alt="Cristiano Ronaldo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Cristiano Ronaldo</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Footballer</span>
              </div>
            </div>
          </div>

          {/* Review 2: Neymar Jr */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              background: '#C2A368', 
              padding: '30px', 
              borderRadius: '8px', 
              position: 'relative',
              marginBottom: '30px',
              color: '#222',
              textAlign: 'left',
              minHeight: '160px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                "Với tôi, những chiếc đồng hồ không chỉ là món đồ thời trang mà còn là niềm đam mê lớn. LuxeTime luôn cung cấp những sản phẩm quý hiếm với tốc độ và dịch vụ chăm sóc đáng kinh ngạc."
              </p>
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '15px solid #C2A368'
              }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=150&h=150" alt="Neymar Jr" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Neymar Jr</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Footballer</span>
              </div>
            </div>
          </div>

          {/* Review 3: Messi */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              background: '#C2A368', 
              padding: '30px', 
              borderRadius: '8px', 
              position: 'relative',
              marginBottom: '30px',
              color: '#222',
              textAlign: 'left',
              minHeight: '160px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                "Mỗi khi cần tìm một món quà đặc biệt hoặc thêm vào bộ sưu tập cá nhân, tôi luôn chọn cửa hàng này. Sự tỉ mỉ trong quá trình tư vấn và chất lượng sản phẩm thực sự hoàn hảo."
              </p>
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '15px solid #C2A368'
              }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=150&h=150" alt="Lionel Messi" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Lionel Messi</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Footballer</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
         <h2 style={{ marginBottom: '40px' }}>Join the Inner Circle</h2>
         <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
           Subscribe to receive exclusive previews of rare arrivals and private collection invitations.
         </p>
         <div style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '10px' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              id="sub-email"
              style={{ flex: 1, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'white' }} 
            />
            <button 
              className="btn-primary" 
              style={{ padding: '12px 30px' }}
              onClick={async () => {
                const email = (document.getElementById('sub-email') as HTMLInputElement).value;
                if (!email) return toast.error('Please enter your email');
                try {
                  const { data } = await axios.post('http://localhost:5000/api/subscriptions', { email });
                  toast.success(data.message);
                  (document.getElementById('sub-email') as HTMLInputElement).value = '';
                } catch (error: any) {
                  toast.error(error.response?.data?.message || 'Subscription failed');
                }
              }}
            >
              Subscribe
            </button>
         </div>
      </section>
    </>
  );
};

export default HomeScreen;
