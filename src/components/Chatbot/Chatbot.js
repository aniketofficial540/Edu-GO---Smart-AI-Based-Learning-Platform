import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI learning assistant. Ask me anything about your roadmap!", 
      isBot: true 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Clear previous errors
    setError(null);
    
    // Add user message
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          context: "roadmap_assistant" 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'API request failed');
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Empty response from server');
      }

      setMessages(prev => [...prev, { 
        text: data.response, 
        isBot: true 
      }]);
      
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}`,
        isBot: true,
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Always visible toggle button */}
      <button 
        className="chatbot-toggle neon-glow"
        onClick={() => {
          setIsOpen(!isOpen);
          setError(null); // Clear error when toggling
        }}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
        {error && !isOpen && <span className="error-badge">!</span>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window neon-border">
          <div className="chatbot-header">
            <h3>
              <FaRobot className="me-2" />
              Roadmap Assistant
            </h3>
            {error && (
              <div className="connection-error">
                <FaExclamationTriangle /> Connection issue
              </div>
            )}
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`message ${msg.isBot ? 'bot' : 'user'} ${msg.isError ? 'error' : ''}`}
              >
                {msg.isError && <FaExclamationTriangle className="me-2" />}
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <FaSpinner className="spin" /> Thinking...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your roadmap..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button 
              className="send-btn"
              onClick={handleSend}
              disabled={isTyping}
              aria-label="Send message"
            >
              {isTyping ? <FaSpinner className="spin" /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;