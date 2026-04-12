import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Send, User, ChevronLeft } from 'lucide-react';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  fullName: string;
  email: string;
  lastMessage: string;
  lastMessageDate: string;
}

const AdminChatScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo')!);


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('${API_URL}/api/messages/admin/conversations', config);
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [userInfo.token]);

  useEffect(() => {
    const fetchMessages = async (userId: number) => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${API_URL}/api/messages/${userId}`, config);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    if (selectedUser) {
      fetchMessages(selectedUser.id);
      const interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, userInfo.token]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('${API_URL}/api/messages', {
        receiverId: selectedUser.id,
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

  return (
    <div className="container animate-fade-in" style={{ marginTop: '120px', marginBottom: '80px' }}>
      <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '40px' }}>Customer Support</h1>

      <div className="glass admin-chat-container" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: 'calc(100vh - 250px)', minHeight: '500px', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Sidebar - Conversations List */}
        <div style={{ borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>Conversations</h3>
          </div>
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 && (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No active conversations</p>
            )}
            {conversations.map((conv) => (
              <div 
                key={conv.id} 
                onClick={() => setSelectedUser(conv)}
                style={{ 
                  padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                  background: selectedUser?.id === conv.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{conv.fullName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{conv.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main - Chat Content */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '15px 25px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>{selectedUser.fullName}</div>
              </div>

              {/* Chat Messages */}
              <div ref={scrollRef} className="custom-scrollbar" style={{ flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ 
                    alignSelf: msg.senderId === userInfo.id ? 'flex-end' : 'flex-start',
                    maxWidth: '70%', padding: '12px 18px', borderRadius: '15px',
                    background: msg.senderId === userInfo.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                    color: msg.senderId === userInfo.id ? 'black' : 'white',
                    fontSize: '0.95rem'
                  }}>
                    {msg.content}
                    <div style={{ 
                      fontSize: '0.6rem', marginTop: '5px', textAlign: 'right', 
                      opacity: 0.7, color: msg.senderId === userInfo.id ? 'black' : 'var(--text-secondary)' 
                    }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={sendMessage} style={{ padding: '25px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '15px' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                  style={{ 
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                    borderRadius: '12px', padding: '12px 20px', color: 'white', outline: 'none'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={loading || !newMessage.trim()}
                  className="btn-primary"
                  style={{ borderRadius: '12px', padding: '0 25px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Send size={18} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatScreen;
