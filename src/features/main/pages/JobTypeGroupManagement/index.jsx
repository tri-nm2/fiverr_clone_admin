import { Button, Tooltip, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import Style from "./style.module.css";
import instance from "api/instance";
import JobTypeDetailListForm from "features/main/components/JobTypeDetailListForm";
import JobTypeGroupForm from "features/main/components/JobTypeGroupForm";
import {
  CREATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "commons/constants/messages";

function JobTypeGroupManagement() {
  const [jobTypeGroupList, setJobTypeGroupList] = useState(null);
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const keyWord = useRef("");
  const jobTypeList = useRef(null);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên nhóm",
      dataIndex: "tenNhom",
      key: "tenNhom",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (_, group) => {
        return (
          <img
            style={{ width: 40, height: 60 }}
            src={group.hinhAnh}
            alt="error"
          ></img>
        );
      },
    },
    {
      title: "Mã loại công việc",
      dataIndex: "maLoaiCongviec",
      key: "maLoaiCongviec",
    },
    {
      title: "Danh sách chi tiết Loại",
      dataIndex: "dsChiTietLoai",
      key: "dsChiTietLoai",
      render: (_, group) => {
        const tag = group.dsChiTietLoai.map((detail) => {
          return <div key={detail.id}>{detail.tenChiTiet}</div>;
        });
        return tag;
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_, group) => {
        return (
          <div className={Style.btnGroup}>
            <Tooltip title="Chỉnh sửa">
              <button
                onClick={() => {
                  handleUpdateJobTypeGroup(group.id);
                }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa">
              <button
                onClick={() => {
                  handleDeleteJobTypeGroup(group.id);
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Quản lý danh sách chi tiết">
              <button
                onClick={() => {
                  handleManageDetail(group.id);
                }}
              >
                <FormOutlined />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  //Hooks
  useEffect(() => {
    fetchJobTypeGroupList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationConfig.currentPage]);
  //Hooks

  //Api functions
  const fetchJobTypeGroupList = async () => {
    try {
      const response = await instance.request({
        url: "api/chi-tiet-loai-cong-viec/phan-trang-tim-kiem",
        method: "GET",
        params: {
          pageIndex: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          keyword: keyWord.current,
        },
      });

      if (response.status === 200) {
        const dataSource = mapDataSource(response.data.content.data);
        setJobTypeGroupList(dataSource);
        setPaginationConfig({
          ...paginationConfig,
          totalPage: response.data.content.totalRow,
        });
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const fetchJobTypeGroupById = async (groupId) => {
    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/${groupId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setSelectedGroup(response.data.content);
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const fetchJobTypeList = async () => {
    try {
      const response = await instance.request({
        url: "/api/loai-cong-viec",
        method: "GET",
      });

      if (response.status === 200) {
        jobTypeList.current = response.data.content;
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const createJobTypeGroup = async (newJobTypeGroup) => {
    try {
      const response = await instance.request({
        url: "api/chi-tiet-loai-cong-viec/them-nhom-chi-tiet-loai",
        method: "POST",
        data: newJobTypeGroup,
      });

      if (response.status === 201) {
        return response.data.content.id;
      }
    } catch (error) {
      console.log(error.response?.data.content);
      return null;
    }
  };

  const updateJobTypeGroup = async (newJobTypeGroup) => {
    try {
      const response = await instance.request({
        url: `api/chi-tiet-loai-cong-viec/sua-nhom-chi-tiet-loai/${newJobTypeGroup.id}`,
        method: "PUT",
        data: newJobTypeGroup,
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error.response.data.content);
      return false;
    }
  };

  const uploadImage = async (groupId, image) => {
    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/upload-hinh-nhom-loai-cong-viec/${groupId}`,
        method: "POST",
        data: image,
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error.response?.data.content);
      return false;
    }
  };

  const deleteJobTypeGroup = async (groupId) => {
    try {
      const response = await instance.request({
        url: `api/chi-tiet-loai-cong-viec/${groupId}`,
        method: "DELETE",
      });

      if (response.status === 200) {
        fetchJobTypeGroupList();
        showSuccess(DELETE_SUCCESS_MESSAGE);
      }
    } catch (error) {}
  };
  //Api functions

  //Message Box
  const showSuccess = (message) => {
    Modal.success({
      content: <span>{message}</span>,
      onOk() {
        setOpenGroup(false);
      },
    });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      content: <span>Bạn có muốn xóa nhóm loại công việc này</span>,
      onOk() {
        deleteJobTypeGroup(id);
      },
    });
  };
  //Message Box

  //Events
  const handleChangePage = (page, pageSize) => {
    setPaginationConfig({ ...paginationConfig, currentPage: page });
  };

  const handleManageDetail = async (groupId) => {
    await fetchJobTypeGroupById(groupId);
    setOpenDetail(true);
  };

  const handleSubmit = async (newJobTypeGroup, image, action) => {
    switch (action) {
      case "Create":
        const groupId = await createJobTypeGroup(newJobTypeGroup);
        if (groupId) {
          if (image) {
            const resultUpload = await uploadImage(groupId, image);
            if (resultUpload) {
              fetchJobTypeGroupList();
              showSuccess(CREATE_SUCCESS_MESSAGE);
            }
          } else {
            fetchJobTypeGroupList();
            showSuccess(CREATE_SUCCESS_MESSAGE);
          }
        }
        break;
      case "Update":
        const resultUpdateInfo = updateJobTypeGroup(newJobTypeGroup);
        if (resultUpdateInfo) {
          if (image) {
            const resultUpload = await uploadImage(newJobTypeGroup.id, image);
            if (resultUpload) {
              fetchJobTypeGroupList();
              showSuccess(UPDATE_SUCCESS_MESSAGE);
            }
          } else {
            fetchJobTypeGroupList();
            showSuccess(UPDATE_SUCCESS_MESSAGE);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleCreateJobTypeGroup = async () => {
    await fetchJobTypeList();
    setOpenGroup(true);
  };

  const handleUpdateJobTypeGroup = async (groupId) => {
    await fetchJobTypeGroupById(groupId);
    await fetchJobTypeList();
    setOpenGroup(true);
  };

  const handleDeleteJobTypeGroup = (groupId) => {
    showConfirm(groupId);
  };

  const handleCancel = () => {
    setOpenGroup(false);
  };
  //Events

  //Other functions
  const mapDataSource = (data) => {
    const dataSource = data.map((item) => {
      return { ...item, key: item.id };
    });

    return dataSource;
  };
  //Other functions
  return (
    <div className={Style.jobTypeGroup}>
      <div className={Style.jobTypeGroupHeader}>
        <Button type="primary" onClick={handleCreateJobTypeGroup}>
          Thêm nhóm loại công việc
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={jobTypeGroupList}
        pagination={{
          current: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          total: paginationConfig.totalPage,
          onChange: handleChangePage,
        }}
      ></Table>

      <Modal
        title="Thông tin nhóm loại công việc"
        open={openGroup}
        onCancel={() => {
          setOpenGroup(false);
        }}
        destroyOnClose
        footer={null}
      >
        <JobTypeGroupForm
          jobTypeList={jobTypeList.current}
          selectedGroup={selectedGroup}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </Modal>

      <Modal
        title="Quản lý danh sách chi tiết loại"
        open={openDetail}
        onCancel={() => {
          fetchJobTypeGroupList();
          setOpenDetail(false);
        }}
        destroyOnClose
        footer={null}
      >
        <JobTypeDetailListForm selectedGroup={selectedGroup} />
      </Modal>
    </div>
  );
}

export default JobTypeGroupManagement;
