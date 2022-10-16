import { useFormik } from "formik";
import { Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";
import Style from "./style.module.css";

function JobTypeGroupForm(props) {
  const { Option } = Select;
  const selectedGroup = props.selectedGroup;
  const jobTypeList = props.jobTypeList;
  const initialValues = {
    id: selectedGroup?.id,
    tenChiTiet: selectedGroup?.tenNhom,
    maLoaiCongViec: selectedGroup?.maLoaiCongviec,
    hinhAnh: null,
    danhSachChiTiet: [],
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const newJobTypeGroup = {
        id: values.id,
        tenChiTiet: values.tenChiTiet,
        maLoaiCongViec: values.maLoaiCongViec,
        danhSachChiTiet: [],
      };

      let image = null;
      if (values.hinhAnh) {
        image = new FormData();
        image.append("formFile", values.hinhAnh, values.hinhAnh.name);
      }

      if (selectedGroup) {
        props.handleSubmit(newJobTypeGroup, image, "Update");
      } else {
        props.handleSubmit(newJobTypeGroup, image, "Create");
      }
    },
  });

  //Events
  const handleChangeJobType = (value) => {
    formik.setFieldValue("maLoaiCongViec", value);
  };

  const handleChangeImage = (info) => {
    formik.setFieldValue("hinhAnh", info.file);
  };
  //Events

  //Other Functions
  const renderSelectOption = () => {
    const tag = jobTypeList.map((jobType) => {
      return (
        <Option key={jobType.id} value={jobType.id}>
          {jobType.tenLoaiCongViec}
        </Option>
      );
    });

    return tag;
  };
  //Other Functions
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className={Style.inputGroup}>
          <span>Tên nhóm</span>
          <Input
            name="tenChiTiet"
            value={formik.values.tenChiTiet}
            placeholder="Tên nhóm"
            onChange={formik.handleChange}
          ></Input>
        </div>

        <div className={Style.inputGroup}>
          <span>Loại công việc</span>
          <Select
            name="maLoaiCongViec"
            value={formik.values.maLoaiCongViec}
            style={{ width: "100%" }}
            onChange={handleChangeJobType}
          >
            {renderSelectOption()}
          </Select>
        </div>

        <div className={Style.inputGroup}>
          <span>Hình ảnh</span>
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleChangeImage}
          >
            <Button icon={<UploadOutlined />}>Chọn hình</Button>
          </Upload>
        </div>

        <div className={Style.btnGroup}>
          <Button
            type="ghost"
            onClick={() => {
              props.handleCancel();
            }}
          >
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </div>
      </form>
    </div>
  );
}

export default JobTypeGroupForm;
