import { Input, Switch } from "antd";
import React from "react";
import Style from "./style.module.css";

function UserDetail(props) {
  const userInfo = props.selectedUser;

  //Other Functions
  const renderList = (list) => {
    const tag = list.map((item, index) => {
      return <div key={index}>{item}</div>;
    });

    return tag;
  };
  //Other Functions
  return (
    <div className={Style.detail}>
      <div className={Style.content}>
        <span>Id</span>
        <Input value={userInfo.id} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Họ tên</span>
        <Input value={userInfo.name} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Email</span>
        <Input value={userInfo.email} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Số điện thoại</span>
        <Input value={userInfo.phone} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Ngày sinh</span>
        <Input value={userInfo.birthday} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Nam</span>
        <Switch checked={userInfo.gender} disabled />
      </div>

      <div className={Style.content}>
        <span>Phân quyền</span>
        <Input value={userInfo.role} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Kỹ năng</span>
        <div className={Style.list}>{renderList(userInfo.skill)}</div>
      </div>

      <div className={Style.content}>
        <span>Chứng chỉ</span>
        <div className={Style.list}>{renderList(userInfo.certification)}</div>
      </div>
    </div>
  );
}

export default UserDetail;
