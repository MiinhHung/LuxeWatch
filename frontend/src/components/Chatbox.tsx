import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;

  // Admin ID is usually 1, but we should ideally fetch this or have a fixed "Support" contact
  const ADMIN_ID = 1; 

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userInfo || !isOpen) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/messages/${ADMIN_ID}`, config);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
    const interval = isOpen ? setInterval(fetchMessages, 5000) : null;
    return () => { if (interval) clearInterval(interval); };
  }, [isOpen, userInfo?.token]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userInfo) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        receiverId: ADMIN_ID,
        content: newMessage
      }, config);
      
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo || userInfo.role === 'admin') return null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
            border: 'none', cursor: 'pointer'
          }}
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        <div className="glass animate-fade-in" style={{ 
          width: '350px', height: '500px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px', border: '1px solid var(--glass-border)',
          overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '20px', background: 'rgba(212, 175, 55, 0.1)', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1.1rem' }}>Support Chat</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '50px' }}>
                Hi! How can we help you today?
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} style={{ 
                alignSelf: msg.senderId === userInfo.id ? 'flex-end' : 'flex-start',
                maxWidth: '80%', padding: '10px 15px', borderRadius: '15px',
                background: msg.senderId === userInfo.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                color: msg.senderId === userInfo.id ? 'black' : 'white',
                fontSize: '0.9rem', position: 'relative'
              }}>
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ 
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                borderRadius: '10px', padding: '10px', color: 'white', outline: 'none'
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !newMessage.trim()}
              className="btn-primary"
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
