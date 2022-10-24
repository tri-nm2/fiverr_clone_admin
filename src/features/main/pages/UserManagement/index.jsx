import { Button, Table, Tooltip, Input, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ReadOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import Style from "./style.module.css";
import instance from "api/instance";
import {
  CREATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "commons/constants/messages";
import UserForm from "features/main/components/UserForm";
import UserDetail from "features/main/components/UserDetail";

function UserManagement() {
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
  });
  const [userList, setUserList] = useState([]);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Phân quyền",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, user) => {
        return (
          <div key={user.id} className={Style.btnGroup}>
            <Tooltip title="Xem chi tiết">
              <button
                onClick={() => {
                  handleViewDetail(user.id);
                }}
              >
                <ReadOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <button onClick={() => {}}>
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa">
              <button
                onClick={() => {
                  handleDeleteUser(user.id);
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [selectedUser, setSelectedUser] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const keyWord = useRef("");

  //Hooks
  useEffect(() => {
    fetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationConfig.currentPage]);
  //Hooks

  //Api Functions
  const fetchUserList = async () => {
    try {
      const response = await instance.request({
        url: "/api/users/phan-trang-tim-kiem",
        method: "GET",
        params: {
          pageIndex: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          keyword: keyWord.current,
        },
      });

      if (response.status === 200) {
        setUserList(response.data.content.data);
        setPaginationConfig({
          ...paginationConfig,
          totalPage: response.data.content.totalRow,
        });
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await instance.request({
        url: `/api/users/${userId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setSelectedUser(response.data.content);
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const createAdmin = async (adminInfo) => {
    try {
      const response = await instance.request({
        url: "api/users",
        method: "POST",
        data: adminInfo,
      });

      if (response.status === 200) {
        fetchUserList();
        showSuccess(CREATE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await instance.request({
        url: "/api/users/",
        method: "DELETE",
        params: {
          id: userId,
        },
      });

      if (response.status === 200) {
        fetchUserList();
        showSuccess(DELETE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };
  //Api Functions

  //Message Box
  const showSuccess = (message) => {
    Modal.success({
      content: <span>{message}</span>,
      onOk() {
        if (openCreateModal) {
          setOpenCreateModal(false);
        }
      },
    });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      content: <span>Bạn có muốn xóa người dùng này</span>,
      onOk() {
        deleteUser(id);
      },
    });
  };
  //Message Box

  //Events
  const handleChangePage = (page, pageSize) => {
    setPaginationConfig({ ...paginationConfig, currentPage: page });
  };

  const handleSearch = (value) => {
    keyWord.current = value;
    if (paginationConfig.currentPage === 1) {
      fetchUserList();
    } else {
      setPaginationConfig({ ...paginationConfig, currentPage: 1 });
    }
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
  };

  const handleCreateAdmin = (adminInfo) => {
    createAdmin(adminInfo);
  };

  const handleDeleteUser = (userId) => {
    showConfirm(userId);
  };

  const handleViewDetail = async (userId) => {
    await fetchUserById(userId);
    setOpenDetailModal(true);
  };
  //Events

  return (
    <div className={Style.user}>
      <div className={Style.userHeader}>
        <Button
          type="primary"
          onClick={() => {
            setOpenCreateModal(true);
          }}
        >
          Thêm tài khoản admin
        </Button>
        <Input.Search
          className={Style.txtSearch}
          placeholder="Nhập từ khóa tìm kiếm"
          onSearch={handleSearch}
        ></Input.Search>
      </div>
      <Table
        columns={columns}
        dataSource={userList}
        pagination={{
          current: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          total: paginationConfig.totalPage,
          showSizeChanger: false,
          onChange: handleChangePage,
        }}
      ></Table>

      <Modal
        title="Tạo tài khoản admin"
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
        destroyOnClose
        footer={[]}
      >
        <UserForm
          handleCloseModal={handleCloseModal}
          handleCreateAdmin={handleCreateAdmin}
        />
      </Modal>

      <Modal
        title="Thông tin người dùng"
        open={openDetailModal}
        onCancel={() => {
          setSelectedUser(null);
          setOpenDetailModal(false);
        }}
        destroyOnClose
        footer={[]}
      >
        <UserDetail selectedUser={selectedUser} />
      </Modal>
    </div>
  );
}

export default UserManagement;
