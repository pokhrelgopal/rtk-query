import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { todoApi } from "./todoApi";

export const store = configureStore({
  // reducer is a function that describes how the application state changes in response to actions sent to the store. Redux toolkit introduced the idea of reducer slice. A reducer slice is a collection of reducer logic action creators and selectors that are related to a specific feature or domain of your application.
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
