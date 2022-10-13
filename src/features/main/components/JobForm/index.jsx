import React from "react";
import { Button, Input, InputNumber, Rate, TreeSelect, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Style from "./style.module.css";
import { useFormik } from "formik";

function JobForm(props) {
  const userId = localStorage.getItem("id");
  const jobMenu = props.jobMenu;
  const initialValues = {
    id: 0,
    tenCongViec: "",
    danhGia: 0,
    giaTien: 0,
    nguoiTao: +userId,
    hinhAnh: "",
    moTa: "",
    maChiTietLoaiCongViec: 0,
    moTaNgan: "",
    saoCongViec: 0,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      props.handleSubmit(values, null, "Create");
    },
  });

  const { TreeNode } = TreeSelect;

  //Events
  const handleRatingChange = (value) => {
    formik.setFieldValue("danhGia", value);
  };
  const handlePriceChange = (value) => {
    formik.setFieldValue("giaTien", value);
  };
  const handleChangeRate = (value) => {
    formik.setFieldValue("saoCongViec", value);
  };

  const handleChangeJobTypeDetail = (value) => {
    formik.setFieldValue("maChiTietLoaiCongViec", value);
  };
  //Events

  //Other Functions
  const renderTreeNode = () => {
    const tag = jobMenu.map((category) => {
      return (
        <TreeNode
          key={`category-${category.id}`}
          value={`category-${category.id}`}
          title={category.tenLoaiCongViec}
          selectable={false}
        >
          {category.dsNhomChiTietLoai.map((groupDetail) => {
            return (
              <TreeNode
                key={groupDetail.id}
                value={groupDetail.id}
                title={groupDetail.tenNhom}
                selectable={false}
              >
                {groupDetail.dsChiTietLoai.map((detail) => {
                  return (
                    <TreeNode
                      key={detail.id}
                      value={detail.id}
                      title={detail.tenChiTiet}
                    ></TreeNode>
                  );
                })}
              </TreeNode>
            );
          })}
        </TreeNode>
      );
    });

    return tag;
  };
  //Other Functions

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className={Style.form}>
          <div className={Style.content}>
            <span>Tên công việc</span>
            <Input
              name="tenCongViec"
              value={formik.values.tenCongViec}
              onChange={formik.handleChange}
            ></Input>
          </div>

          <div className={Style.content}>
            <span>Đánh giá</span>
            <InputNumber
              name="danhGia"
              style={{ width: "100%" }}
              min={0}
              value={formik.values.danhGia}
              onChange={handleRatingChange}
            ></InputNumber>
          </div>

          <div className={Style.content}>
            <span>Giá tiền</span>
            <InputNumber
              name="giaTien"
              style={{ width: "100%" }}
              min={0}
              value={formik.values.giaTien}
              onChange={handlePriceChange}
            ></InputNumber>
          </div>

          <div className={Style.filePicker}>
            <span className={Style.title}>Hình ảnh</span>
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn hình</Button>
            </Upload>
          </div>

          <div className={Style.content}>
            <span>Mô tả</span>
            <Input.TextArea
              name="moTa"
              rows={6}
              value={formik.values.moTa}
              style={{ resize: "none" }}
              onChange={formik.handleChange}
            />
          </div>

          <div className={Style.content}>
            <span>Mô tả ngắn</span>
            <Input.TextArea
              name="moTaNgan"
              rows={4}
              value={formik.values.moTaNgan}
              style={{ resize: "none" }}
              onChange={formik.handleChange}
            />
          </div>

          <div className={Style.content}>
            <span>Chi tiết loại công việc</span>
            <TreeSelect
              showSearch
              style={{
                width: "100%",
              }}
              dropdownStyle={{
                maxHeight: 500,
                overflow: "auto",
              }}
              placeholder="Vui lòng chọn loại công việc"
              allowClear
              onChange={handleChangeJobTypeDetail}
            >
              {renderTreeNode()}
            </TreeSelect>
          </div>

          <div className={Style.content}>
            <span>Sao công việc</span>
            <Rate
              name="saoCongViec"
              value={formik.values.saoCongViec}
              onChange={handleChangeRate}
            />
          </div>

          <div className={Style.btnGroup}>
            <Button
              type="ghost"
              onClick={() => {
                props.handleCloseModal();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
