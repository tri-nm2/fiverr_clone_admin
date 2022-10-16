import { Button, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import Style from "./style.module.css";
import instance from "api/instance";

function JobTypeDetailListForm(props) {
  const groupId = props.selectedGroup.id;
  const [detailList, setDetailList] = useState([]);
  const [detailName, setDetailName] = useState("");
  const selectedDetail = useRef(null);

  //Hooks
  useEffect(() => {
    fetchDetailList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Hooks

  //Api Functions
  const fetchDetailList = async () => {
    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/${groupId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setDetailList(response.data.content.dsChiTietLoai);
      }
    } catch (error) {}
  };

  const fetchDetailById = async (detailId) => {
    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/${detailId}`,
        method: "GET",
      });

      if (response.status === 200) {
        selectedDetail.current = response.data.content;
        setDetailName(response.data.content.tenChiTiet);
      }
    } catch (error) {}
  };

  const addDetail = async (detail) => {
    try {
      const response = await instance.request({
        url: "/api/chi-tiet-loai-cong-viec/them-nhom-chi-tiet-loai",
        method: "POST",
        data: detail,
      });

      if (response.status === 201) {
        return response.data.content.id;
      }
    } catch (error) {
      console.log(error.response?.data.content);
      return null;
    }
  };

  const updateDetail = async (detailId) => {
    const newDetail = {
      id: 0,
      tenChiTiet: detailName,
    };

    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/${detailId}`,
        method: "PUT",
        data: newDetail,
      });

      if (response.status === 200) {
        fetchDetailList();
        setDetailName("");
        selectedDetail.current = null;
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const deleteDetail = async (detailId) => {
    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/${detailId}`,
        method: "DELETE",
      });

      if (response.status === 200) {
        fetchDetailList();
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };

  const updateDetailList = async (detailId) => {
    const newDetailList = mapDetailIdList();
    newDetailList.push(detailId);
    const groupInfo = {
      id: 0,
      tenChiTiet: props.selectedGroup.tenNhom,
      maLoaiCongViec: props.selectedGroup.maLoaiCongviec,
      danhSachChiTiet: newDetailList,
    };

    try {
      const response = await instance.request({
        url: `/api/chi-tiet-loai-cong-viec/sua-nhom-chi-tiet-loai/${groupId}`,
        method: "PUT",
        data: groupInfo,
      });

      if (response.status === 200) {
        fetchDetailList();
        setDetailName("");
      }
    } catch (error) {
      console.log(error.response?.data.content);
    }
  };
  //Api Functions

  //Events
  const handleChange = (e) => {
    setDetailName(e.target.value);
  };

  const handleSubmit = async (action) => {
    switch (action) {
      case "Create":
        const newDetail = {
          id: 0,
          tenChiTiet: detailName,
        };

        const detailId = await addDetail(newDetail);
        if (detailId) {
          await updateDetailList(detailId);
        }
        break;
      case "Update":
        updateDetail(selectedDetail.current.id);
        break;
      default:
        break;
    }
  };

  const handleUpdateDetail = (detailId) => {
    fetchDetailById(detailId);
  };

  const handleDeleteDetail = (detailId) => {
    deleteDetail(detailId);
  };
  //Events

  //Other functions
  const renderDetailList = () => {
    const tag = detailList?.map((detail) => {
      return (
        <div key={detail.id} className={Style.detailList}>
          <span>{detail.tenChiTiet}</span>
          <div className={Style.btnGroup}>
            <button
              onClick={() => {
                handleUpdateDetail(detail.id);
              }}
            >
              <EditOutlined />
            </button>
            <button onClick={() => handleDeleteDetail(detail.id)}>
              <DeleteOutlined />
            </button>
          </div>
        </div>
      );
    });

    return tag;
  };

  const mapDetailIdList = () => {
    const newDetailList = detailList.map((detail) => detail.id);
    return newDetailList;
  };
  //Other functions
  return (
    <div>
      <form className={Style.detailForm}>
        <Input
          className={Style.txtInput}
          value={detailName}
          placeholder="Tên chi tiết"
          onChange={handleChange}
        ></Input>
        <div className={Style.btn}>
          <Button
            type="primary"
            onClick={() => {
              if (selectedDetail.current) {
                console.log("Update");
                handleSubmit("Update");
              } else {
                console.log("Create");
                handleSubmit("Create");
              }
            }}
          >
            Gửi
          </Button>
        </div>
      </form>
      <div>{renderDetailList()}</div>
    </div>
  );
}

export default JobTypeDetailListForm;
