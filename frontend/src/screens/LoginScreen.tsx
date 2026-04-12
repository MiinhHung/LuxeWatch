import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) navigate('/profile');
  }, [navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      toast.success('Successfully logged in!');
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      marginTop: '60px'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at top center, rgba(212,175,55,0.08) 0%, transparent 60%)',
        zIndex: -1
      }}></div>

      <div className="glass animate-slide-up" style={{ 
        maxWidth: '450px', 
        width: '100%', 
        padding: '50px 40px', 
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(212,175,55,0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your exclusive collection.</p>
        </div>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="aristocrat@example.com"
                style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '10px', transition: 'border 0.3s' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '10px', transition: 'border 0.3s' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.05rem', borderRadius: '10px' }} disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Sign In <LogIn size={18} />
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            New to LuxeTime? <Link to="/register" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Register <ArrowRight size={14}/></Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
