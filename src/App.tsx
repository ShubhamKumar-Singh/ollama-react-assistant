import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setInput, addMessage, setLoading, resetInput, toggleTheme } from './chatSlice';
import { askOllama } from './ollamaApi';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Animated background styles
  const backgroundStyle = isDark ? {
    background: `
      linear-gradient(-45deg, #0a0a0a, #1a1321, #0f1423, #1a0a1a)`,
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
  } : {
    background: `
      linear-gradient(-45deg, #f5f5f5, #eae8f0, #f0f5f8, #f5f0f0)`,
    backgroundSize: '400% 400%',
    animation: 'gradientShiftLight 15s ease infinite',
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
          paddingTop: '100px',
          paddingBottom: '40px',
          color: isDark ? '#fff' : '#1a1a1a',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Clock Display */}
        <Clock />

        {/* Header Section */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          marginBottom: '40px',
          animation: 'slideInUp 0.6s ease',
        }}>
          <h1 style={{ 
            fontSize: 56, 
            fontWeight: 700, 
            marginBottom: 12,
            letterSpacing: '-1px',
          }}>
            Hey! <span style={{ 
              background: isDark 
                ? 'linear-gradient(135deg, #4ef3c2, #2eccd8)' 
                : 'linear-gradient(135deg, #00d4aa, #0099ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Bro
            </span>
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: isDark ? '#b0b0b0' : '#666',
            fontWeight: 400,
            marginBottom: 0,
            letterSpacing: '0.3px',
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
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            color: isDark ? '#fff' : '#1a1a1a',
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
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Chat Card */}
        <div
          style={{
            width: '700px',
            maxWidth: '90vw',
            background: isDark 
              ? 'rgba(20,22,46,0.75)' 
              : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 32,
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(78,243,194,0.1)'
              : '0 8px 32px rgba(0,0,0,0.1), 0 0 20px rgba(0,212,170,0.05)',
            border: isDark 
              ? '1px solid rgba(78,243,194,0.2)' 
              : '1px solid rgba(0,212,170,0.2)',
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
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
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
                        ? isDark 
                          ? 'linear-gradient(135deg, #1e3a2f, #2a5a4a)' 
                          : 'linear-gradient(135deg, #00d4aa, #00c99f)'
                        : isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                    color:
                      msg.sender === 'user'
                        ? '#fff'
                        : isDark ? '#fff' : '#1a1a1a',
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
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}>●</span>
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
              background: isDark 
                ? 'rgba(20,22,46,0.6)' 
                : 'rgba(0,0,0,0.03)',
              borderRadius: 20,
              padding: '12px 20px',
              border: isDark
                ? '1px solid rgba(78,243,194,0.15)'
                : '1px solid rgba(0,212,170,0.15)',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(78,243,194,0.4)' : 'rgba(0,212,170,0.4)';
              e.currentTarget.style.boxShadow = isDark 
                ? '0 0 16px rgba(78,243,194,0.1)' 
                : '0 0 16px rgba(0,212,170,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(78,243,194,0.15)' : 'rgba(0,212,170,0.15)';
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
                color: isDark ? '#fff' : '#1a1a1a',
                outline: 'none',
                fontSize: 15,
                fontWeight: 400,
              }}
              onFocus={(e) => {
                e.currentTarget.parentElement!.style.borderColor = isDark ? 'rgba(78,243,194,0.4)' : 'rgba(0,212,170,0.4)';
                e.currentTarget.parentElement!.style.boxShadow = isDark 
                  ? '0 0 16px rgba(78,243,194,0.1)' 
                  : '0 0 16px rgba(0,212,170,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.parentElement!.style.borderColor = isDark ? 'rgba(78,243,194,0.15)' : 'rgba(0,212,170,0.15)';
                e.currentTarget.parentElement!.style.boxShadow = 'none';
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #4ef3c2, #2eccd8)'
                  : 'linear-gradient(135deg, #00d4aa, #0099ff)',
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
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 8px 20px rgba(78,243,194,0.3)'
                    : '0 8px 20px rgba(0,212,170,0.3)';
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
            background: ${isDark ? 'rgba(78,243,194,0.3)' : 'rgba(0,212,170,0.3)'};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(78,243,194,0.5)' : 'rgba(0,212,170,0.5)'};
          }
        `}</style>
      </div>
    </>
  );
}

export default App;
