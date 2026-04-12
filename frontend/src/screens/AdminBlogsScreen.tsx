import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Link as LinkIcon, Calendar } from 'lucide-react';

const AdminBlogsScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/blogs');
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deleteHandler = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, config);
        toast.success('Article removed successfully');
        fetchPosts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Magazine Management</h1>
           <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Manage your editorial content and brand stories.</p>
        </div>
        <button onClick={() => navigate('/admin/blog/create')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Create New Post
        </button>
      </div>

      <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3 className="glow-text">Loading archive...</h3>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>ID</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>TITLE</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>CATEGORY</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>DATE</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }} className="table-row-hover">
                  <td style={{ padding: '20px 10px', color: 'var(--text-secondary)' }}>#{post.id}</td>
                  <td style={{ padding: '20px 10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{post.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <LinkIcon size={12} /> {post.slug}
                    </div>
                  </td>
                  <td style={{ padding: '20px 10px' }}>
                    <span style={{ 
                      background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', 
                      padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 
                    }}>
                      {post.category}
                    </span>
                  </td>
                  <td style={{ padding: '20px 10px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '20px 10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/admin/blog/${post.id}/edit`)} 
                        className="btn-outline" 
                        style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteHandler(post.id)} 
                        className="btn-outline" 
                        style={{ padding: '8px', borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBlogsScreen;
