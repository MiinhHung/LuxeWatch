import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CatalogScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/brands')
        ]);
        setCategories(catData.data);
        setBrands(brandData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: searchParams.get('keyword') || '',
          categoryId: searchParams.get('category') || '',
          brandId: searchParams.get('brand') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
        };
        const { data } = await axios.get('http://localhost:5000/api/products', { params });
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newParams: any = {};
    if (keyword) newParams.keyword = keyword;
    if (category) newParams.category = category;
    if (brand) newParams.brand = brand;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        
        {/* Sidebar Filters */}
        <aside>
          <div className="glass" style={{ padding: '30px', position: 'sticky', top: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SlidersHorizontal size={20} color="var(--accent-gold)"/> Filters
              </h3>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Clear All</button>
            </div>

            <form onSubmit={applyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Search</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={keyword} 
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Ref name..." 
                    style={{ width: '100%', padding: '10px 10px 10px 35px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }} 
                  />
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }}>
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price Range ($)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }} />
                  <span>-</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white' }} />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Apply Results</button>
            </form>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
             <h2 style={{ margin: 0 }}>Showing {products.length} Timepieces</h2>
             {searchParams.toString() && (
               <div style={{ display: 'flex', gap: '10px' }}>
                 {searchParams.get('keyword') && <span className="glass" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>"{searchParams.get('keyword')}" <X size={12} cursor="pointer" onClick={() => { setKeyword(''); applyFilters(); }}/></span>}
               </div>
             )}
          </div>

          {loading ? (
            <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--accent-gold)' }}>Updating collection...</div>
          ) : (
            <>
              {products.length === 0 ? (
                <div style={{ padding: '100px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No matches found for your criteria.</p>
                  <button onClick={clearFilters} className="btn-outline" style={{ marginTop: '20px' }}>Reset all filters</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogScreen;
