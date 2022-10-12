import React from "react";
import { Button, Input } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import { REQUIRED_MESSAGE } from "commons/constants/messages";
import Style from "./style.module.css";

function JobTypeForm(props) {
  const initialValues = {
    tenLoaiCongViec: props.selectedJobType?.tenLoaiCongViec,
  };

  const schema = yup.object().shape({
    tenLoaiCongViec: yup.string().required(REQUIRED_MESSAGE),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      let newJobType = {};

      if (props.selectedJobType) {
        newJobType = { ...values, id: props.selectedJobType.id };
        props.handleSubmit(newJobType, "Update");
      } else {
        newJobType = { ...values, id: 0 };
        props.handleSubmit(newJobType, "Create");
      }
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className={Style.inputGroup}>
          <Input
            name="tenLoaiCongViec"
            placeholder="Tên loại công việc"
            value={formik.values.tenLoaiCongViec}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.tenLoaiCongViec && formik.touched.tenLoaiCongViec && (
            <span>{formik.errors.tenLoaiCongViec}</span>
          )}
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
      </form>
    </div>
  );
}

export default JobTypeForm;
