import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';

const BlogPostScreen = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/blogs/${slug}`);
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
      <h2 className="glow-text">Opening Archive...</h2>
    </div>
  );

  if (!post) return (
    <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
      <h2>Article not found</h2>
      <Link to="/magazine" className="btn-primary" style={{ marginTop: '20px' }}>Back to Magazine</Link>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ marginTop: '80px' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '600px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={post.image.startsWith('/uploads') ? `http://localhost:5000${post.image}` : post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,1))'
        }} />
        
        <div className="container" style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ 
            background: 'var(--accent-gold)', color: 'black', 
            padding: '4px 15px', borderRadius: '4px', fontSize: '0.8rem', 
            fontWeight: 800, textTransform: 'uppercase', display: 'inline-block',
            marginBottom: '20px', letterSpacing: '2px'
          }}>
            {post.category}
          </div>
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '30px', maxWidth: '900px' }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '30px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent-gold)" /> By {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent-gold)" /> {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 0', display: 'grid', gridTemplateColumns: 'minmax(0, 800px) 300px', gap: '80px' }}>
        <article>
          <Link to="/magazine" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back to Library
          </Link>
          
          <p style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginBottom: '50px', lineHeight: 1.6 }}>
            {post.excerpt}
          </p>
          
          <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.3px' }}>
             {/* Content usually would be rich text, here we break by newlines for demo */}
             {post.content.split('\n').map((paragraph: string, i: number) => (
                <p key={i} style={{ marginBottom: '30px' }}>{paragraph}</p>
             ))}
          </div>

          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <p style={{ color: 'var(--text-secondary)' }}>Share this story</p>
             <div style={{ display: 'flex', gap: '15px' }}>
                <button className="btn-outline" style={{ padding: '10px' }}><Share2 size={20} /></button>
             </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          <div className="glass" style={{ padding: '30px', borderRadius: '15px', position: 'sticky', top: '120px' }}>
             <h4 style={{ color: 'var(--accent-gold)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Editorial Note</h4>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Established in 1994, LuxeTime Magazine is dedicated to long-form storytelling about the world's most intricate mechanical wonders.
             </p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>8 min read</span>
             </div>
             
             <button className="btn-primary" style={{ width: '100%', marginTop: '30px' }} onClick={() => window.location.href='/catalog'}>
               Shop Collection
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPostScreen;
