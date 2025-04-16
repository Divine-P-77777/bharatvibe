// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import themeReducer from "./themeSlice";

// Persist config for theme
const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["isDarkMode"],
};

// Combine reducers (only theme now)
const rootReducer = combineReducers({
  theme: persistReducer(themePersistConfig, themeReducer),
});

// Create the store
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

const { store, persistor } = makeStore();

export { store, persistor };

// Type exports for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
