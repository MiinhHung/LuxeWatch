import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { Loader2 } from 'lucide-react';

const PaymentResultScreen = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const orderId = searchParams.get('orderId');
  const responseCode = searchParams.get('vnp_ResponseCode');
  const method = searchParams.get('method');

  useEffect(() => {
    const verify = async () => {
      if (method === 'cod') {
        setSuccess(true);
        setMessage('Your request has been received. Our master couriers will contact you shortly for signature delivery.');
        setLoading(false);
        return;
      }

      if (!responseCode) {
        setLoading(false);
        setMessage('Missing transaction details.');
        return;
      }

      try {
        // Correct way: Send all VNPay params back to backend for signature verification
        const { data } = await axios.get(`${API_URL}/api/payments/verify?${searchParams.toString()}`);
        
        if (data.success) {
           setSuccess(true);
           setMessage(`Order authenticated. Your luxury timepiece will be prepared immediately.`);
        } else {
           setSuccess(false);
           setMessage(data.message || 'The transaction could not be completed. Please attempt authentication again.');
        }
      } catch (err) {
        console.error(err);
        setMessage('Error synchronizing with local vault.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams, method, responseCode]);

  return (
    <div className="container" style={{ marginTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
      <div className="glass animate-slide-up" style={{ display: 'inline-block', padding: '60px 80px', borderRadius: '20px' }}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={64} color="var(--accent-gold)" style={{ margin: '0 auto 30px' }} />
            <h2 className="glow-text">Authenticating Acquisition...</h2>
          </>
        ) : (
          <>
            {success ? (
              <>
                <div style={{ fontSize: '5rem', marginBottom: '20px' }}>✨</div>
                <h1 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                  {method === 'cod' ? 'Heritage Selection Reserved' : 'Acquisition Verified'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
                   {message}
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '5rem', marginBottom: '20px' }}>❌</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Authentication Failed</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '400px' }}>{message}</p>
              </>
            )}
            <Link to="/" className="btn-primary">Return to Collection</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResultScreen;
