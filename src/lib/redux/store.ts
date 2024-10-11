import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "@/redux/slices/authSlice";
// import chatReducer from "@/redux/slices/chatSlice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
