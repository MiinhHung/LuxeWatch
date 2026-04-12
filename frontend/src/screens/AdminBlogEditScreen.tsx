import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Loader2, Globe, Upload } from 'lucide-react';

const AdminBlogEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Heritage');
  const [author, setAuthor] = useState('LuxeTime Editorial');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${API_URL}/api/blogs/id/${id}`, config);
          
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setExcerpt(data.excerpt);
          setImage(data.image);
          setCategory(data.category);
          setAuthor(data.author);
          setFetching(false);
        } catch (error) {
          console.error(error);
          toast.error('Failed to load article');
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditMode]);

  const generateSlug = (val: string) => {
    setTitle(val);
    if (!isEditMode) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('${API_URL}/api/uploads', formData, config);
      setImage(data.url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = { title, slug, content, excerpt, image, category, author };

      if (isEditMode) {
        await axios.put(`${API_URL}/api/blogs/${id}`, payload, config);
        toast.success('Article updated');
      } else {
        await axios.post('${API_URL}/api/blogs', payload, config);
        toast.success('Article published');
      }
      navigate('/admin/blogs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container" style={{ marginTop: '150px' }}><h2 className="glow-text">Loading Details...</h2></div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <Link to="/admin/blogs" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to List
      </Link>

      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>
        {isEditMode ? 'Edit Magazine Article' : 'Compose New Story'}
      </h1>

      <form onSubmit={submitHandler} className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Title and Slug */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Article Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => generateSlug(e.target.value)}
              required
              placeholder="The future of craftsmanship..."
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', transition: 'border 0.3s' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>URL Slug</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="my-article-slug"
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', transition: 'border 0.3s' }}
              />
              <Globe size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>

        {/* Category and Author */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Category</label>
            <select 
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            >
              <option value="Heritage">Heritage</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Trends">Trends</option>
              <option value="Style">Style</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Author Name</label>
            <input 
              type="text" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Image Upload Area */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Cover Image</label>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              placeholder="https://images.unsplash.com/..."
              style={{ flex: 1, padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
            />
            <label style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)',
                borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)')}
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" onChange={uploadFileHandler} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
          {image && (
            <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', height: '250px', background: 'black' }}>
              <img src={image} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Short Excerpt (Summary)</label>
          <textarea 
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={3}
            placeholder="A brief introduction to the article..."
            style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        {/* Content */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Full Content (Rich Text / Story)</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            placeholder="Tell your story here..."
            style={{ width: '100%', padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', resize: 'vertical', lineHeight: 1.8, fontSize: '1.05rem', fontFamily: 'inherit' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <button type="submit" disabled={loading || uploading} className="btn-primary" style={{ flex: 2, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isEditMode ? 'Save Changes & Update Magazine' : 'Publish to Magazine'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blogs')} className="btn-outline" style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditScreen;
