import { configureStore } from "@reduxjs/toolkit";
import authenReducer from "features/authentication/authenSlice";

const store = configureStore({
  reducer: {
    authen: authenReducer.reducer,
  },
});

export default store;
