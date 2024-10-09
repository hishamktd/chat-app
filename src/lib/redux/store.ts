import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/slices/authSlice";
import chatReducer from "@/lib/redux/slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
