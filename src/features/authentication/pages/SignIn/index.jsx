import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Input } from "antd";
import Style from "./style.module.css";
import { REQUIRED_MESSAGE } from "commons/constants/messages";
import { signInAction } from "../../action";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function SignIn() {
  const schema = yup.object().shape({
    email: yup.string().required(REQUIRED_MESSAGE),
    passWord: yup.string().required(REQUIRED_MESSAGE),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      passWord: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      signIn(values);
    },
  });

  const dispatch = useDispatch();
  const history = useHistory();

  //Api functions
  const signIn = (info) => {
    dispatch(signInAction(info, history));
  };
  //Api functions

  return (
    <div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className={Style.signInForm}>
            <div className={Style.inputGroup}>
              <Input
                name="email"
                className={Style.txtEmail}
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></Input>
              {formik.errors.email && formik.touched.email && (
                <span className={Style.errorMessage}>
                  {formik.errors.passWord}
                </span>
              )}
            </div>
            <div className={Style.inputGroup}>
              <Input.Password
                name="passWord"
                className={Style.txtPassWord}
                placeholder="Mật khẩu"
                value={formik.values.passWord}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></Input.Password>
              {formik.errors.passWord && formik.touched.passWord && (
                <span className={Style.errorMessage}>
                  {formik.errors.passWord}
                </span>
              )}
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
