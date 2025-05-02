// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import themeReducer from './themeSlice';

let persistStore: any, persistReducer: any, storage: any;

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  persistStore = require('redux-persist').persistStore;
  persistReducer = require('redux-persist').persistReducer;
  storage = require('redux-persist/lib/storage').default;
}

const themePersistConfig = {
  key: 'theme',
  storage: isBrowser ? storage : undefined,
  whitelist: ['isDarkMode'],
};

const rootReducer = combineReducers({
  theme: isBrowser && persistReducer
    ? persistReducer(themePersistConfig, themeReducer)
    : themeReducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });

  const persistor = isBrowser && persistStore ? persistStore(store) : null;
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
