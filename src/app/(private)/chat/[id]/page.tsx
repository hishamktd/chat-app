import React from "react";
import { Box } from "@mui/material";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import UserList from "@/components/UserList";

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: "200px", borderRight: "1px solid #ccc" }}>
        <UserList />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow chatId={params.id} />
        <MessageInput
          onSendMessage={(message) => console.log("Send message:", message)}
        />
      </Box>
    </Box>
  );
}
