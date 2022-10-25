import React from "react";
import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import Style from "./style.module.css";

function PageSidebar() {
  const items = [
    { key: "item1", label: <NavLink to="/usermanagement">Quản lý người dùng</NavLink> },
    {
      key: "item2",
      label: <NavLink to="/jobmanagement">Quản lý công việc</NavLink>,
    },
    {
      key: "item3",
      label: "Quản lý loại công việc",
      children: [
        {
          key: "sub-item1",
          label: <NavLink to="/">Loại công việc</NavLink>,
        },
        {
          key: "sub-item2",
          label: (
            <NavLink to="/jobtypegroupmanagement">Nhóm loại công việc</NavLink>
          ),
        },
      ],
    },
    { key: "item4", label: <NavLink to="/">Quản lý dịch vụ</NavLink> },
  ];
  return (
    <Layout.Sider className={Style.sideBar}>
      <div>
        <Menu mode="inline" theme="dark" items={items} />
      </div>
    </Layout.Sider>
  );
}

export default PageSidebar;
