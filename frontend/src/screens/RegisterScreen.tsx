import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
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
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { fullName, email, password });
      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      toast.success('Registration successful!');
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ marginTop: '120px', maxWidth: '500px', marginBottom: '60px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Create Account</h1>

      <form className="glass" onSubmit={submitHandler} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Full Name</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-gold)' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterScreen;
