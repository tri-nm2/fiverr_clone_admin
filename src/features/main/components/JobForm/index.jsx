import React from "react";
import { Button, Input, InputNumber, Rate, TreeSelect, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Style from "./style.module.css";
import { useFormik } from "formik";

function JobForm(props) {
  const userId = localStorage.getItem("id");
  const jobMenu = props.jobMenu;
  const selectedJob = props.selectedJob;
  const initialValues = {
    id: selectedJob?.id,
    tenCongViec: selectedJob?.tenCongViec,
    danhGia: selectedJob?.danhGia,
    giaTien: selectedJob?.giaTien,
    nguoiTao: +userId,
    hinhAnh: null,
    moTa: selectedJob?.moTa,
    maChiTietLoaiCongViec: selectedJob?.maChiTietLoaiCongViec,
    moTaNgan: selectedJob?.moTaNgan,
    saoCongViec: selectedJob?.saoCongViec,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const imageInfo = selectedJob ? selectedJob.hinhAnh : "";
      const jobInfo = {
        id: values.id,
        tenCongViec: values.tenCongViec,
        danhGia: values.danhGia,
        giaTien: values.giaTien,
        nguoiTao: +userId,
        hinhAnh: imageInfo,
        moTa: values.moTa,
        maChiTietLoaiCongViec: values.maChiTietLoaiCongViec,
        moTaNgan: values.moTaNgan,
        saoCongViec: values.saoCongViec,
      };

      let image = null;
      if (values.hinhAnh) {
        image = new FormData();
        image.append("formFile", values.hinhAnh, values.hinhAnh.name);
      }

      if (selectedJob) {
        props.handleSubmit(jobInfo, image, "Update");
      } else {
        props.handleSubmit(jobInfo, image, "Create");
      }
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

  const handleChangeImage = (info) => {
    formik.setFieldValue("hinhAnh", info.file);
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
            <span>T??n c??ng vi???c</span>
            <Input
              name="tenCongViec"
              value={formik.values.tenCongViec}
              onChange={formik.handleChange}
            ></Input>
          </div>

          <div className={Style.content}>
            <span>????nh gi??</span>
            <InputNumber
              name="danhGia"
              style={{ width: "100%" }}
              min={0}
              value={formik.values.danhGia}
              defaultValue={0}
              onChange={handleRatingChange}
            ></InputNumber>
          </div>

          <div className={Style.content}>
            <span>Gi?? ti???n</span>
            <InputNumber
              name="giaTien"
              style={{ width: "100%" }}
              min={0}
              defaultValue={0}
              value={formik.values.giaTien}
              onChange={handlePriceChange}
            ></InputNumber>
          </div>

          <div className={Style.filePicker}>
            <span className={Style.title}>H??nh ???nh</span>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleChangeImage}
            >
              <Button icon={<UploadOutlined />}>Ch???n h??nh</Button>
            </Upload>
          </div>

          <div className={Style.content}>
            <span>M?? t???</span>
            <Input.TextArea
              name="moTa"
              rows={6}
              value={formik.values.moTa}
              style={{ resize: "none" }}
              onChange={formik.handleChange}
            />
          </div>

          <div className={Style.content}>
            <span>M?? t??? ng???n</span>
            <Input.TextArea
              name="moTaNgan"
              rows={4}
              value={formik.values.moTaNgan}
              style={{ resize: "none" }}
              onChange={formik.handleChange}
            />
          </div>

          <div className={Style.content}>
            <span>Chi ti???t lo???i c??ng vi???c</span>
            <TreeSelect
              showSearch
              allowClear
              style={{
                width: "100%",
              }}
              dropdownStyle={{
                maxHeight: 500,
                overflow: "auto",
              }}
              placeholder="Vui l??ng ch???n lo???i c??ng vi???c"
              value={formik.values.maChiTietLoaiCongViec}
              onChange={handleChangeJobTypeDetail}
            >
              {renderTreeNode()}
            </TreeSelect>
          </div>

          <div className={Style.content}>
            <span>Sao c??ng vi???c</span>
            <Rate
              name="saoCongViec"
              defaultValue={0}
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
              H???y
            </Button>
            <Button type="primary" htmlType="submit">
              G???i
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
