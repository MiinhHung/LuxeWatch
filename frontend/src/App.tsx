import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CatalogScreen from './screens/CatalogScreen';
import AdminRoute from './components/AdminRoute';
import WishlistScreen from './screens/WishlistScreen';
import AdminProductsScreen from './screens/AdminProductsScreen';
import AdminSubscriptionsScreen from './screens/AdminSubscriptionsScreen';
import AdminProductEditScreen from './screens/AdminProductEditScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminOrdersScreen from './screens/AdminOrdersScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import AdminChatScreen from './screens/AdminChatScreen';
import AdminCouponsScreen from './screens/AdminCouponsScreen';
import PaymentResultScreen from './screens/PaymentResultScreen';
import BlogScreen from './screens/BlogScreen';
import BlogPostScreen from './screens/BlogPostScreen';
import AdminBlogsScreen from './screens/AdminBlogsScreen';
import AdminBlogEditScreen from './screens/AdminBlogEditScreen';
import Chatbox from './components/Chatbox';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const AppLayout = () => {
  const [cartCount, setCartCount] = useState(0);
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  useEffect(() => {
    const updateCartCount = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartCount(items.reduce((acc: number, item: any) => acc + item.qty, 0));
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <>
      <header className="glass" style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 0', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ color: 'var(--accent-gold)', margin: 0 }}>LUXE</h2>
          </Link>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <Link to="/">Home</Link>
            <Link to="/catalog">Shop</Link>
            <Link to="/magazine">Magazine</Link>
            <Link to="/cart" style={{ position: 'relative' }}>
              Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-10px', right: '-15px',
                  background: 'var(--accent-gold)', color: 'black',
                  fontSize: '0.7rem', fontWeight: 700,
                  width: '18px', height: '18px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {userInfo && userInfo.role === 'admin' && (
              <div className="admin-dropdown" style={{ marginRight: '15px' }}>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Admin Panel <span style={{ fontSize: '0.7rem' }}>▼</span>
                </span>
                <div className="admin-dropdown-content">
                  <Link to="/admin/dashboard" className="admin-dropdown-item">📊 Stats Dashboard</Link>
                  <Link to="/admin/productlist" className="admin-dropdown-item">📦 Products Management</Link>
                  <Link to="/admin/orderlist" className="admin-dropdown-item">📜 Orders Management</Link>
                  <Link to="/admin/userlist" className="admin-dropdown-item">👥 User Management</Link>
                  <Link to="/admin/couponlist" className="admin-dropdown-item">🎫 Coupons Management</Link>
                  <Link to="/admin/blogs" className="admin-dropdown-item">📖 Magazine Management</Link>
                  <Link to="/admin/chat" className="admin-dropdown-item">💬 Customer Support</Link>
                  <Link to="/admin/subscriptions" className="admin-dropdown-item">📧 Subscription Inbox</Link>
                </div>
              </div>
            )}
            {userInfo ? (
              <>
                <Link to="/wishlist" style={{ color: 'white', display: 'flex', alignItems: 'center', fontSize: '1.2rem', marginRight: '5px' }}>❤️</Link>
                <Link to="/profile" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{userInfo.fullName}</Link>
                <button onClick={logoutHandler} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>
        </div>
      </header>

      <main style={{ minHeight: '85vh' }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/catalog" element={<CatalogScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/payment-result" element={<PaymentResultScreen />} />
          <Route path="/magazine" element={<BlogScreen />} />
          <Route path="/magazine/:slug" element={<BlogPostScreen />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboardScreen />} />
            <Route path="productlist" element={<AdminProductsScreen />} />
            <Route path="product/create" element={<AdminProductEditScreen />} />
            <Route path="product/:id/edit" element={<AdminProductEditScreen />} />
            <Route path="orderlist" element={<AdminOrdersScreen />} />
            <Route path="userlist" element={<AdminUsersScreen />} />
            <Route path="couponlist" element={<AdminCouponsScreen />} />
            <Route path="chat" element={<AdminChatScreen />} />
            <Route path="subscriptions" element={<AdminSubscriptionsScreen />} />
            <Route path="blogs" element={<AdminBlogsScreen />} />
            <Route path="blog/create" element={<AdminBlogEditScreen />} />
            <Route path="blog/:id/edit" element={<AdminBlogEditScreen />} />
          </Route>
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>&copy; 2026 LUXE Timepieces. All Rights Reserved.</p>
      </footer>
      <Chatbox />
      <ToastContainer theme="dark" position="bottom-right" />

    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;

