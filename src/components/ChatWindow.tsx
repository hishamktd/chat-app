import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "@/redux/slices/chatSlice";
import { Box, Typography } from "@mui/material";

const ChatWindow = ({ chatId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    dispatch(fetchMessages(chatId));
  }, [chatId, dispatch]);

  return (
    <Box sx={{ height: "400px", overflowY: "scroll" }}>
      {messages.map((message) => (
        <Typography key={message.id}>{message.content}</Typography>
      ))}
    </Box>
  );
};

export default ChatWindow;
