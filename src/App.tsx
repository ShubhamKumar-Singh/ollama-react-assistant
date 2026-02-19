import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setInput, addMessage, setLoading, resetInput, toggleTheme } from './chatSlice';
import { askOllama } from './ollamaApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import blackPantherBg from './black_panther_is_sitting_in_car_background_4k_hd_black_panther-3840x2160.jpg';

// Clock Component for displaying time and date
function Clock() {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      setTime(`${timeString} • ${dateString}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '30px',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: '0.5px',
      zIndex: 100,
    }}>
      {time}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const input = useSelector((state: RootState) => state.chat.input);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const theme = useSelector((state: RootState) => state.chat.theme);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    dispatch(addMessage({ sender: 'user', text: userMessage }));
    dispatch(setLoading(true));
    dispatch(resetInput());

    try {
      const response = await askOllama(userMessage);
      dispatch(addMessage({ sender: 'ai', text: response }));
    } catch {
      dispatch(addMessage({ sender: 'ai', text: 'Error getting response.' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isDark = theme === 'dark';

  // Background styles with your Black Panther image
  const backgroundStyle = isDark ? {
    backgroundImage: `
      linear-gradient(135deg, rgba(10, 10, 10, 0.75), rgba(26, 19, 33, 0.75), rgba(15, 20, 35, 0.75), rgba(26, 10, 26, 0.75)),
      url('${blackPantherBg}')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } : {
    backgroundImage: `
      linear-gradient(135deg, rgba(245, 245, 245, 0.9), rgba(235, 235, 250, 0.9), rgba(240, 248, 255, 0.9), rgba(250, 245, 245, 0.9)),
      url('${blackPantherBg}')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientShiftLight {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        code, pre {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
      
      <div
        style={{
          minHeight: '100vh',
          ...backgroundStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingBottom: '40px',
          color: '#fff',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Clock Display */}
        <Clock />

        {/* Header Section */}
        <div style={{ 
          position: 'fixed', 
          top: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, 
          animation: 'slideInUp 0.6s ease',
          textAlign: 'center',
        }}>
          <h1 style={{ 
            fontSize: 56, 
            fontWeight: 700, 
            marginBottom: 12,
            letterSpacing: '-1px',
            color: '#fff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          }}>
            Hey! <span style={{ 
              background: 'linear-gradient(135deg, #4ef3c2, #2eccd8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}>
              Bro
            </span>
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: '#b0b0b0',
            fontWeight: 400,
            marginBottom: 0,
            letterSpacing: '0.3px',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
          }}>
            What can I help with?
          </p>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            position: 'fixed',
            top: '20px',
            left: '30px',
            background: 'rgba(20, 22, 46, 0.6)',
            border: '1px solid rgba(78, 243, 194, 0.3)',
            color: '#fff',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(20, 22, 46, 0.8)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(78,243,194,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(20, 22, 46, 0.6)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Chat Card */}
        <div
          style={{
            width: '700px',
            maxWidth: '90vw',
            background: 'rgba(15, 20, 35, 0.85)',
            backdropFilter: 'blur(30px)',
            borderRadius: 28,
            padding: 32,
            boxShadow: '0 16px 60px rgba(0,0,0,0.5), 0 0 30px rgba(78,243,194,0.15)',
            border: '1px solid rgba(78,243,194,0.3)',
            animation: 'slideInUp 0.8s ease 0.1s backwards',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Messages Section */}
          <div
            style={{
              height: '380px',
              overflowY: 'auto',
              marginBottom: 28,
              paddingRight: 12,
              scrollBehavior: 'smooth',
            }}
          >
            {messages.length === 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'center',
              }}>
                Start a conversation...
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    background:
                      msg.sender === 'user'
                        ? 'linear-gradient(135deg, #1e3a2f, #2a5a4a)' 
                        : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '14px 18px',
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    animation: 'slideInUp 0.3s ease',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ 
                color: isDark ? '#4ef3c2' : '#00d4aa',
                fontSize: 15,
                fontWeight: 500,
                animation: 'slideInUp 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                
                Thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(15, 20, 35, 0.9)',
              borderRadius: 20,
              padding: '12px 20px',
              border: '1px solid rgba(78,243,194,0.3)',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(78,243,194,0.5)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(78,243,194,0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(78,243,194,0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => dispatch(setInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: 15,
                fontWeight: 400,
              }}
              onFocus={(e) => {
                e.currentTarget.parentElement!.style.borderColor = 'rgba(78,243,194,0.5)';
                e.currentTarget.parentElement!.style.boxShadow = '0 0 20px rgba(78,243,194,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.parentElement!.style.borderColor = 'rgba(78,243,194,0.3)';
                e.currentTarget.parentElement!.style.boxShadow = 'none';
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #4ef3c2, #2eccd8)',
                border: 'none',
                borderRadius: 14,
                padding: '10px 18px',
                fontWeight: 600,
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                fontSize: 16,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(78,243,194,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ↗
            </button>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(78,243,194,0.3);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(78,243,194,0.5);
          }
        `}</style>
      </div>
    </>
  );
}

export default App;
