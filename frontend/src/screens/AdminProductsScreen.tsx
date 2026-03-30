import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProductsScreen = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/product/create');
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>Product Management</h1>
        <button onClick={createProductHandler} className="btn-primary" style={{ padding: '12px 24px' }}>
          + Add New Product
        </button>
      </div>

      <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
        {loading ? (
          <p style={{ color: 'var(--accent-gold)' }}>Loading products...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>ID</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>NAME</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>PRICE</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>CATEGORY</th>
                <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px 10px', color: 'var(--text-secondary)' }}>#{product.id}</td>
                  <td style={{ padding: '20px 10px', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '20px 10px', color: 'var(--accent-gold)' }}>${product.price}</td>
                  <td style={{ padding: '20px 10px' }}>{product.category?.name}</td>
                  <td style={{ padding: '20px 10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/admin/product/${product.id}/edit`} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>Edit</Link>
                      <button onClick={() => deleteHandler(product.id)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Delete</button>
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

export default AdminProductsScreen;
