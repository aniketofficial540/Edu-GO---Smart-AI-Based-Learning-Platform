import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { 
  RiRobot2Line, 
  RiUser3Line, 
  RiSendPlaneFill, 
  RiDeleteBinLine,
  RiRefreshLine
} from 'react-icons/ri';
import { BsLightningChargeFill } from 'react-icons/bs';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Edo, your AI learning assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "I'm analyzing your query about '" + input + "'. Here's what I recommend...",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm Edo, your AI learning assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container fluid className="chatbot-container">
      <Row className="chatbot-header">
        <Col className="d-flex align-items-center">
          <RiRobot2Line className="chatbot-icon" />
          <h4>Edo - AI Learning Assistant</h4>
          <div className="ms-auto">
            <Button variant="link" onClick={clearChat} title="Clear chat">
              <RiDeleteBinLine />
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="chatbot-messages">
        <Col>
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                <div className="message-avatar">
                  {message.sender === 'bot' ? 
                    <RiRobot2Line /> : 
                    <RiUser3Line />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">
                  <RiRobot2Line />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Col>
      </Row>

      <Row className="chatbot-input">
        <Col>
          <Form onSubmit={handleSend}>
            <div className="input-group">
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about learning paths..."
                className="chat-input"
              />
              <Button 
                type="submit" 
                className="send-button"
                disabled={isLoading}
              >
                <RiSendPlaneFill />
              </Button>
            </div>
            <div className="quick-prompts">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setInput("How do I start learning AI?")}
              >
                Start learning AI
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setInput("Best resources for machine learning")}
              >
                ML Resources
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setInput("Create a roadmap for web development")}
              >
                Web Dev Roadmap
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Row className="chatbot-footer">
        <Col className="text-center">
          <small className="text-muted">
            <BsLightningChargeFill className="text-warning" /> Powered by AI Learning Hub
          </small>
        </Col>
      </Row>
    </Container>
  );
}

export default Chatbot;