import React from "react";
import Style from "./style.module.css";
import { useSelector, useDispatch } from "react-redux";
import authenSlice from "features/authentication/authenSlice";
import { useHistory } from "react-router-dom";

function PageHeader() {
  const userInfo = useSelector((state) => state.authen.userInfo);
  const dispatch = useDispatch();
  const history = useHistory();

  //Events
  const signOut = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(authenSlice.actions.clearUserInfo());
    history.push("/signin");
  };
  //Events

  return (
    <div className={Style.pageHeader}>
      <div className={Style.userAction}>
        <button>{userInfo?.name}</button>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default PageHeader;
