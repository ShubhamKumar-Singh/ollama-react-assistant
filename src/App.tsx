import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setInput, addMessage, setLoading, resetInput } from './chatSlice';
import { askOllama } from './ollamaApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const input = useSelector((state: RootState) => state.chat.input);
  const loading = useSelector((state: RootState) => state.chat.loading);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f1020 0%, #1b1d3a 40%, #101223 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '80px',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <h1 style={{ fontSize: 48, fontWeight: 700 }}>
        Hey! <span style={{ color: '#4ef3c2' }}>Bro</span>
      </h1>
      <p style={{ fontSize: 22, color: '#cfcfcf' }}>
        What can I help with?
      </p>

      

      {/* Chat Card */}
      <div
        style={{
          width: '650px',
          maxWidth: '95vw',
          background: 'rgba(25,27,55,0.95)',
          borderRadius: 24,
          padding: 25,
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Messages */}
        <div
          style={{
            height: 320,
            overflowY: 'auto',
            marginBottom: 20,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent:
                  msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  background:
                    msg.sender === 'user'
                      ? '#1e3a2f'
                      : '#ffffff',
                  color:
                    msg.sender === 'user'
                      ? '#fff'
                      : '#000',
                  padding: '12px 16px',
                  borderRadius: 14,
                  fontSize: 15,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ color: '#aaa' }}>Thinking...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#14162e',
            borderRadius: 30,
            padding: '8px 16px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask me anything......."
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontSize: 16,
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: '#4ef3c2',
              border: 'none',
              borderRadius: 12,
              padding: '8px 16px',
              fontWeight: 600,
            }}
          >
            ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
