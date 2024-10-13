'use client';

import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { TMessage } from '@/types/message';

const ChatPage = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = { text: inputValue };

      await fetch('/api/chat-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      setInputValue('');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat-room');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TMessage[] = await response.json();
      setMessages(data ?? []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [inputValue]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat Room
      </Typography>

      <Paper
        variant="outlined"
        sx={{ maxHeight: 400, overflowY: 'auto', mb: 2, p: 2 }}
      >
        <List>
          {messages &&
            messages?.map((message) => (
              <ListItem key={message?.id}>
                <Box>
                  <Typography variant="subtitle2">
                    {message?.user?.username} -{' '}
                    <span style={{ color: 'gray' }}>
                      {dayjs(message.created_at).format('HH:mm A')}
                    </span>
                  </Typography>
                  <Typography variant="body1">{message.text}</Typography>
                </Box>
              </ListItem>
            ))}
        </List>
      </Paper>

      <TextField
        fullWidth
        label="Type your message"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        margin="normal"
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSendMessage}
        sx={{ mt: 2 }}
      >
        Send
      </Button>
    </Box>
  );
};

export default ChatPage;
