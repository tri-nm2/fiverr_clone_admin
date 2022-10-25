import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import Style from "./style.module.css";
import {
  REQUIRED_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  PHONE_FORMAT_MESSAGE,
} from "commons/constants/messages";
import { Input, Button } from "antd";

function UserForm(props) {
  const schema = yup.object().shape({
    name: yup.string().required(REQUIRED_MESSAGE),
    email: yup.string().required(REQUIRED_MESSAGE).email(EMAIL_FORMAT_MESSAGE),
    password: yup.string().required(REQUIRED_MESSAGE),
    phone: yup
      .string()
      .required(REQUIRED_MESSAGE)
      .matches(/^[0-9 ]+$/g, PHONE_FORMAT_MESSAGE),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const adminInfo = {
        id: 0,
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        birthday: "",
        gender: true,
        role: "ADMIN",
        skill: [],
        certification: [],
      };

      props.handleCreateAdmin(adminInfo);
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className={Style.form}>
          <div className={Style.content}>
            <span className={Style.label}>Họ tên</span>
            <Input
              name="name"
              values={formik.values.name}
              placeholder="Họ tên"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></Input>
            {formik.errors.name && formik.touched.name && (
              <span className={Style.errorMessage}>{formik.errors.name}</span>
            )}
          </div>

          <div className={Style.content}>
            <span className={Style.label}>Email</span>
            <Input
              name="email"
              values={formik.values.email}
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></Input>
            {formik.errors.email && formik.touched.email && (
              <span className={Style.errorMessage}>{formik.errors.email}</span>
            )}
          </div>

          <div className={Style.content}>
            <span className={Style.label}>Mật khẩu</span>
            <Input.Password
              name="password"
              values={formik.values.password}
              placeholder="Mật khẩu"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></Input.Password>
            {formik.errors.password && formik.touched.password && (
              <span className={Style.errorMessage}>
                {formik.errors.password}
              </span>
            )}
          </div>

          <div className={Style.content}>
            <span className={Style.label}>Số điện thoại</span>
            <Input
              name="phone"
              values={formik.values.phone}
              placeholder="Số điện thoại"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></Input>
            {formik.errors.phone && formik.touched.phone && (
              <span className={Style.errorMessage}>{formik.errors.phone}</span>
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
        </div>
      </form>
    </div>
  );
}

export default UserForm;
