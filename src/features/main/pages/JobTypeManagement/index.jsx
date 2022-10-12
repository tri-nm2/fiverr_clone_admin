import { Button, Table, Tooltip, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import instance from "api/instance";
import React, { useEffect, useState } from "react";
import Style from "./style.module.css";
import {
  CREATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "commons/constants/messages";
import JobTypeForm from "features/main/components/JobTypeForm";

function JobTypeManagement() {
  const [jobTypeList, setJobTypeList] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên loại công việc",
      dataIndex: "tenLoaiCongViec",
      key: "tenLoaiCongViec",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, item) => {
        return (
          <div className={Style.btnGroup}>
            <Tooltip title="Chỉnh sửa">
              <button
                key={item.id}
                onClick={() => {
                  handleSelectJobType(item.id);
                }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa">
              <button
                onClick={() => {
                  handleDeleteJobType(item.id);
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Thêm chi tiết">
              <button
                onClick={() => {
                  handleCreateJobTypeDetailGroup(item.id);
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
    fetchJobTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Hooks

  //Api functions
  const fetchJobTypeList = async () => {
    try {
      const response = await instance.request({
        url: "/api/loai-cong-viec",
        method: "GET",
      });

      if (response.status === 200) {
        const dataSource = mapApiDataToDatasource(response.data.content);
        setJobTypeList(dataSource);
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const fetchJobTypeById = async (id) => {
    try {
      const response = await instance.request({
        url: `/api/loai-cong-viec/${id}`,
        method: "GET",
      });

      if (response.status === 200) {
        setSelectedJobType(response.data.content);
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const handleSubmit = async (newJobType, action) => {
    switch (action) {
      case "Create":
        try {
          await instance.request({
            url: "/api/loai-cong-viec",
            method: "POST",
            data: newJobType,
          });

          showSuccess(CREATE_SUCCESS_MESSAGE);

          fetchJobTypeList();
        } catch (error) {
          console.log(error.response?.data.content);
        }
        break;
      case "Update":
        try {
          await instance.request({
            url: `/api/loai-cong-viec/${newJobType.id}`,
            method: "PUT",
            data: newJobType,
          });

          showSuccess(UPDATE_SUCCESS_MESSAGE);

          fetchJobTypeList();
        } catch (error) {
          console.log(error.response?.data.content);
        }
        break;
      default:
        break;
    }
  };

  const deleteJobType = async (id) => {
    try {
      await instance.request({
        url: `/api/loai-cong-viec/${id}`,
        method: "DELETE",
      });

      showSuccess(DELETE_SUCCESS_MESSAGE);

      fetchJobTypeList();
    } catch (errors) {
      console.log(errors.response?.data.contetn);
    }
  };
  //Api functions

  //Message Box
  const showSuccess = (message) => {
    Modal.success({
      content: <span>{message}</span>,
      onOk() {
        setOpenModal(false);
      },
    });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      content: <span>Bạn có muốn xóa loại công việc này</span>,
      onOk() {
        deleteJobType(id);
      },
    });
  };
  //Message Box

  //Events
  const handleDeleteJobType = async (id) => {
    showConfirm(id);
  };

  const handleSelectJobType = async (id) => {
    await fetchJobTypeById(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateJobTypeDetailGroup = async (id) => {
    // const danhSachChiTiet = [
    //   { id: 0, tenChiTiet: "Game Tester" },
    //   { id: 0, tenChiTiet: "Software Tester" },
    // ];

    const danhSachChiTiet = [
      {
        id: 2,
        tenChiTiet: "Logo Design",
      },
      {
        id: 3,
        tenChiTiet: "Brand Style Guides",
      },
    ];

    // const data = new FormData();
    // data.append("id", 0);
    // data.append("tenChiTiet", "Tester");
    // data.append("maLoaiCongViec", id);
    // danhSachChiTiet.forEach((item) => data.append("danhSachChiTiet[]", item));
    const data = {
      id: 0,
      tenChiTiet: "Tester",
      maLoaiCongViec: id,
      danhSachChiTiet: danhSachChiTiet,
    };

    try {
      const response = await instance.request({
        url: "/api/chi-tiet-loai-cong-viec/sua-nhom-chi-tiet-loai/35",
        method: "PUT",
        data: data,
      });
      console.log(response.data.content);
    } catch (error) {
      console.log(error.response.data.content);
    }
  };
  //Events

  //Other functions
  const mapApiDataToDatasource = (data) => {
    const dataSource = data.map((item) => {
      return { ...item, key: item.id };
    });

    return dataSource;
  };
  //Other functions

  return (
    <div className={Style.jobType}>
      <Button
        className={Style.btn}
        type="primary"
        onClick={() => {
          setSelectedJobType(null);
          setOpenModal(true);
        }}
      >
        Thêm Loại cộng việc
      </Button>
      <Table columns={columns} dataSource={jobTypeList} />
      <Modal
        title="Thêm loại công việc"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        destroyOnClose
        footer={null}
      >
        <JobTypeForm
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          selectedJobType={selectedJobType}
        />
      </Modal>
    </div>
  );
}

export default JobTypeManagement;
