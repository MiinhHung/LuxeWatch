import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

const BlogScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Heritage', 'Maintenance', 'Trends'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const url = activeCategory === 'All' 
          ? 'http://localhost:5000/api/blogs' 
          : `http://localhost:5000/api/blogs?category=${activeCategory}`;
        const { data } = await axios.get(url);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]);

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '100px' }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '1rem' }}>
          LuxeTime Journal
        </span>
        <h1 style={{ fontSize: '4rem', marginTop: '10px', marginBottom: '20px' }}>The Magazine</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Exploring the intersections of heritage, craftsmanship, and the eternal pursuit of precision. Welcome to our curated world of horology.
        </p>
      </header>

      {/* Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '8px 25px', borderRadius: '30px', fontSize: '0.9rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
           <h2 className="glow-text">Curating content...</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {posts.map(post => (
            <div key={post.id} className="animate-slide-up">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
      
      {posts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No articles found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default BlogScreen;
