import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  content: string;
  isUser: boolean;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        content: data.response,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            p: 2, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                bgcolor: message.isUser ? 'primary.main' : 'grey.200',
                color: message.isUser ? 'white' : 'text.primary',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography>{message.content}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
};