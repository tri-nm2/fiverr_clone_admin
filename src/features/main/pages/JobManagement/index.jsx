import { Button, Table, Rate, Tooltip, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ReadOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import instance from "api/instance";
import Style from "./style.module.css";
import JobDetail from "features/main/components/JobDetail";
import JobForm from "features/main/components/JobForm";
import {
  CREATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "commons/constants/messages";

function JobManagement() {
  const userId = localStorage.getItem("id");
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
  });
  const [jobList, setJobList] = useState([]);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "tenCongViec",
      key: "tenCongViec",
      width: "20%",
    },
    {
      title: "Đánh giá",
      dataIndex: "danhGia",
      key: "danhGia",
      width: "10%",
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      key: "giaTien",
      width: "10%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (_, job) => {
        return (
          <img
            style={{ width: 40, height: 60 }}
            src={job.hinhAnh}
            alt="error"
          ></img>
        );
      },
    },
    {
      title: "Sao công việc",
      dataIndex: "saoCongViec",
      key: "saoCongViec",
      render: (_, job) => {
        return <Rate allowHalf value={job.saoCongViec} />;
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_, job) => {
        return (
          <div className={Style.btnGroup}>
            <Tooltip title="Xem chi tiết">
              <button
                onClick={() => {
                  handleViewDetail(job.id);
                }}
              >
                <ReadOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <button
                style={
                  +userId === job.nguoiTao
                    ? { display: "block" }
                    : { display: "none" }
                }
                // onClick={() => {
                //   handleSelectJobType(item.id);
                // }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa">
              <button
                style={
                  +userId === job.nguoiTao
                    ? { display: "block" }
                    : { display: "none" }
                }
                onClick={() => {
                  handleDeleteJob(job.id);
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
  const [openDetail, setOpenDetail] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const createUser = useRef(null);
  const jobMenu = useRef(null);

  //Hooks
  useEffect(() => {
    fetchJobList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationConfig.currentPage]);
  //Hooks

  //Api functions
  const fetchJobList = async () => {
    try {
      const response = await instance.request({
        url: "/api/cong-viec/phan-trang-tim-kiem",
        method: "GET",
        params: {
          pageIndex: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
        },
      });

      if (response.status === 200) {
        const dataSource = mapDataSource(response.data.content.data);
        setJobList(dataSource);
        setPaginationConfig({
          ...paginationConfig,
          totalPage: response.data.content.totalRow,
        });
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const fetchJobById = async (id) => {
    try {
      const response = await instance.request({
        url: `/api/cong-viec/${id}`,
        method: "GET",
      });

      if (response.status === 200) {
        setSelectedJob(response.data.content);
        return response.data.content.nguoiTao;
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await instance.request({
        url: `/api/users/${id}`,
        method: "GET",
      });

      if (response.status === 200) {
        createUser.current = response.data.content;
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await instance.request({
        url: "/api/cong-viec/lay-menu-loai-cong-viec",
        method: "GET",
      });

      if (response.status === 200) {
        jobMenu.current = response.data.content;
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await instance.request({
        url: `api/cong-viec/${id}`,
        method: "DELETE",
      });

      if (response.status === 200) {
        fetchJobList();
        showSuccess(DELETE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      console.log(error.response.data.content);
    }
  };

  const createJob = async (jobInfo) => {
    try {
      const response = await instance.request({
        url: "/api/cong-viec",
        method: "POST",
        data: jobInfo,
      });

      return response.data.content.id;
    } catch (error) {
      console.log(error.response.data.content);
      return null;
    }
  };
  //Api functions

  //Message Boxes
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
      content: <span>Bạn có muốn xóa công việc này</span>,
      onOk() {
        deleteJob(id);
      },
    });
  };
  //Message Boxes

  //Events
  const handleChangePage = (page, pageSize) => {
    setPaginationConfig({ ...paginationConfig, currentPage: page });
  };

  const handleViewDetail = async (id) => {
    const userId = await fetchJobById(id);
    await fetchUserById(userId);
    setOpenDetail(true);
  };

  const handleDeleteJob = (id) => {
    showConfirm(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateJob = async () => {
    await fetchMenu();
    setOpenModal(true);
  };

  const handleSubmit = async (jobInfo, image, action) => {
    switch (action) {
      case "Create":
        const jobId = await createJob(jobInfo);
        if (jobId) {
          fetchJobList();
          showSuccess(CREATE_SUCCESS_MESSAGE);
        }
        break;
      default:
        break;
    }
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
    <div className={Style.job}>
      <Button className={Style.btn} type="primary" onClick={handleCreateJob}>
        Thêm công việc
      </Button>
      <Table
        columns={columns}
        dataSource={jobList}
        pagination={{
          current: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          total: paginationConfig.totalPage,
          onChange: handleChangePage,
        }}
      ></Table>
      <Modal
        title="Thông tin chi tiết"
        open={openDetail}
        onCancel={() => {
          setOpenDetail(false);
        }}
        destroyOnClose
        footer={[]}
      >
        <JobDetail selectedJob={selectedJob} createUser={createUser.current} />
      </Modal>

      <Modal
        title="Thông tin công việc"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        destroyOnClose
        footer={[]}
      >
        <JobForm
          handleCloseModal={handleCloseModal}
          handleSubmit={handleSubmit}
          jobMenu={jobMenu.current}
        />
      </Modal>
    </div>
  );
}

export default JobManagement;
