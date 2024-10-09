import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: string) => {
    const response = await fetch(`/api/messages?chatId=${chatId}`);
    return response.json();
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages = action.payload;
      });
  },
});

export default chatSlice.reducer;
