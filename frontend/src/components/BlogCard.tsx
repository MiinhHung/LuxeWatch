import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: any;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
        <img 
          src={post.image.startsWith('/uploads') ? `${API_URL}${post.image}` : post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
          className="blog-card-img"
        />
        <div style={{ 
          position: 'absolute', top: '20px', left: '20px', 
          background: 'var(--accent-gold)', color: 'black', 
          padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', 
          fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' 
        }}>
          {post.category}
        </div>
      </div>
      
      <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} color="var(--accent-gold)" /> 
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={14} color="var(--accent-gold)" /> 
            {post.author}
          </span>
        </div>
        
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', lineHeight: 1.3 }}>{post.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px', flex: 1 }}>
          {post.excerpt}
        </p>
        
        <Link 
          to={`/magazine/${post.slug}`} 
          style={{ 
            marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', 
            color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.9rem', 
            letterSpacing: '1px', textTransform: 'uppercase' 
          }}
        >
          Read Article <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
