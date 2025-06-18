import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const MessagesContainer = styled.div`
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
  
  ${props => props.role === 'user' ? `
    background-color: #007bff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : `
    background-color: #e9ecef;
    color: #212529;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        chatHistory: messages
      }, {
        headers: {
          'user-id': userId
        }
      });

      const botMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: "Désolé, une erreur s'est produite. Veuillez réessayer." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <h2>Gestionnaire de Patrimoine</h2>
      <MessagesContainer>
        {messages.length === 0 ? (
          <Message role="assistant">
            Bonjour! Je suis votre conseiller en gestion de patrimoine. Comment puis-je vous aider aujourd'hui?
          </Message>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} role={msg.role}>
              {msg.content}
            </Message>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Posez votre question..."
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Envoi...' : 'Envoyer'}
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;