import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { bookApi } from "./services/api";
import userReducer from "./slices/user";

const rootReducer = combineReducers({
  [bookApi.reducerPath]: bookApi.reducer,
  user: userReducer
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat(bookApi.middleware);
  },
  devTools: true
});

setupListeners(store.dispatch);

export default store;
