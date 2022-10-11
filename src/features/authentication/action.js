import instace from "api/instance";
import authenSlice from "./authenSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signInAction = (info, history) => {
  return async (dispatch) => {
    try {
      const response = await instace.request({
        url: "/api/auth/signin",
        method: "POST",
        data: info,
      });

      if (
        response.status === 200 &&
        response.data.content.user.role === "ADMIN"
      ) {
        localStorage.setItem("id", response.data.content.user.id);
        localStorage.setItem("token", response.data.content.token);
        dispatch(authenSlice.actions.addUserInfo(response.data.content.user));
        history.push("/");
      } else {
        alert("Bạn không có quyền truy cập trang này");
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };
};

export const fetchUserInfoAction = createAsyncThunk(
  "authen/fetchUserInfo",
  async (userId) => {
    try {
      const response = await instace.request({
        url: `api/users/${userId}`,
        method: "GET",
      });

      if (response.status === 200) {
        return response.data.content;
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  }
);
