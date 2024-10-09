import React, { FC, SyntheticEvent, useState } from "react";
import { TextField, Button, Box } from "@mui/material";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}
const MessageInput: FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <Button type="submit" variant="contained">
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
