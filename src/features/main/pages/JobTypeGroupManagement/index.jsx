import { Button, Tooltip, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import Style from "./style.module.css";
import instance from "api/instance";
import JobTypeDetailListForm from "features/main/components/JobTypeDetailListForm";

function JobTypeGroupManagement() {
  const [jobTypeGroupList, setJobTypeGroupList] = useState(null);
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const keyWord = useRef("");

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
                  // handleUpdateJob(job.id);
                }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa">
              <button
                onClick={() => {
                  // handleDeleteJob(job.id);
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
  //Api functions

  //Events
  const handleChangePage = (page, pageSize) => {
    setPaginationConfig({ ...paginationConfig, currentPage: page });
  };

  const handleManageDetail = async (groupId) => {
    await fetchJobTypeGroupById(groupId);
    setOpenDetail(true);
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
        <Button type="primary">Thêm nhóm loại công việc</Button>
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
        title="Quản lý danh sách chi tiết loại"
        open={openDetail}
        onCancel={() => {
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
