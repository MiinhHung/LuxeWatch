import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { toast } from 'react-toastify';

const AdminProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [stock, setStock] = useState('0');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
  const authConfig = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          axios.get('${API_URL}/api/categories'),
          axios.get('${API_URL}/api/brands')
        ]);
        setCategories(catData.data);
        setBrands(brandData.data);

        if (id) {
          const { data } = await axios.get(`${API_URL}/api/products/${id}`);
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price.toString());
          setCategoryId(data.categoryId.toString());
          setBrandId(data.brandId.toString());
          setStock(data.stock.toString());
          // Parse existing images
          try {
            const parsed = JSON.parse(data.images);
            setImageList(Array.isArray(parsed) ? parsed : []);
          } catch {
            setImageList(data.images ? [data.images] : []);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch product data');
      }
    };
    fetchData();
  }, [id]);

  const uploadImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await axios.post('${API_URL}/api/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo?.token}`
          }
        });
        newUrls.push(`${API_URL}${data.url}`);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setImageList(prev => [...prev, ...newUrls]);
    setUploading(false);
    if (newUrls.length > 0) toast.success(`${newUrls.length} image(s) uploaded!`);
  };

  const removeImage = (index: number) => {
    setImageList(prev => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageList.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    try {
      setLoading(true);
      const productData = {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        brandId: parseInt(brandId),
        images: imageList,   // send as array, backend will JSON.stringify
        stock: parseInt(stock)
      };

      if (id) {
        await axios.put(`${API_URL}/api/products/${id}`, productData, authConfig);
        toast.success('Product updated!');
      } else {
        await axios.post('${API_URL}/api/products', productData, authConfig);
        toast.success('Product created!');
      }
      navigate('/admin/productlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ marginTop: '120px', maxWidth: '700px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>
        {id ? 'Edit Product' : 'Create Product'}
      </h1>

      <form className="glass" onSubmit={submitHandler} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Product Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Price ($)</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4}
            style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Brand</label>
            <select value={brandId} onChange={e => setBrandId(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>
            Product Images
          </label>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '30px', border: '2px dashed var(--accent-gold)', borderRadius: '8px',
            cursor: 'pointer', background: 'rgba(212,175,55,0.05)', transition: 'background 0.3s'
          }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
          >
            <span style={{ fontSize: '2rem' }}>📷</span>
            <span style={{ color: 'var(--accent-gold)', marginTop: '10px' }}>
              {uploading ? 'Uploading...' : 'Click to select images (JPG, PNG, WEBP)'}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '5px' }}>
              Multiple files supported, max 5MB each
            </span>
            <input type="file" multiple accept="image/*" onChange={uploadImageHandler}
              style={{ display: 'none' }} disabled={uploading} />
          </label>

          {/* Image Previews */}
          {imageList.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {imageList.map((url, index) => (
                <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={url} alt={`img-${index}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                      borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
                      fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Stock Inventory</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} required
            style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading || uploading}>
            {loading ? 'Processing...' : (id ? 'Update Product' : 'Create Product')}
          </button>
          <button type="button" onClick={() => navigate('/admin/productlist')} className="btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditScreen;
