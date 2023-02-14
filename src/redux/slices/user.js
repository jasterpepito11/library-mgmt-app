import { createSlice } from "@reduxjs/toolkit";
const initialUserState = { user: null };

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login: (state, action) => {
      console.log("here: ", state.user);
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
