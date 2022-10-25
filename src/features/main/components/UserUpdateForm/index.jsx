import React, { useRef } from "react";
import { Input, DatePicker, Switch, Select, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { getToday } from "commons/ultils/date";
import moment from "moment";
import Style from "./style.module.css";

function UserUpdateForm(props) {
  const userInfo = props.selectedUser;
  const birthday = userInfo.birthday ? userInfo.birthday : getToday();
  const formik = useFormik({
    initialValues: {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      birthday: birthday,
      gender: userInfo.gender,
      role: userInfo.role,
      skill: userInfo.skill,
      certification: userInfo.certification,
    },
    onSubmit: (values) => {
      props.handleUpdateUser(values);
    },
  });
  const txtSkill = useRef();
  const txtCertification = useRef();

  //Events
  const handleChangeBirthday = (date, dateString) => {
    formik.setFieldValue("birthday", dateString);
  };

  const handleChangeGender = (checked) => {
    formik.setFieldValue("gender", checked);
  };

  const handleChangeRole = (value) => {
    formik.setFieldValue("role", value);
  };

  const handleAddSkill = () => {
    const newSkill = txtSkill.current.input.value;
    if (newSkill !== "") {
      const skillList = formik.values.skill;
      skillList.push(newSkill);
      formik.setFieldValue("skill", skillList);
    }
  };

  const handleDeleteSkill = (skillName) => {
    const skillList = formik.values.skill;
    const deleteIndex = skillList.findIndex((skill) => skill === skillName);
    skillList.splice(deleteIndex, 1);
    formik.setFieldValue("skill", skillList);
  };

  const handleAddCertification = () => {
    const newCertification = txtCertification.current.input.value;
    if (newCertification !== "") {
      const certificationList = formik.values.certification;
      certificationList.push(newCertification);
      formik.setFieldValue("certification", certificationList);
    }
  };

  const handleDeleteCertification = (certificationName) => {
    const certificationList = formik.values.certification;
    const deleteIndex = certificationList.findIndex(
      (certification) => certification === certificationName
    );
    certificationList.splice(deleteIndex, 1);
    formik.setFieldValue("certification", certificationList);
  };
  //Events

  //Other Functions
  const renderSkillList = (skillList) => {
    const tag = skillList.map((skill, index) => {
      return (
        <tr key={index}>
          <td style={{ paddingRight: 10 }}>{skill}</td>
          <td>
            <button
              type="button"
              onClick={() => {
                handleDeleteSkill(skill);
              }}
            >
              <DeleteOutlined />
            </button>
          </td>
        </tr>
      );
    });

    return tag;
  };

  const renderCertificationList = (certificationList) => {
    const tag = certificationList.map((certification, index) => {
      return (
        <tr key={index}>
          <td style={{ paddingRight: 10 }}>{certification}</td>
          <td>
            <button
              type="button"
              onClick={() => {
                handleDeleteCertification(certification);
              }}
            >
              <DeleteOutlined />
            </button>
          </td>
        </tr>
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
            <span>Họ tên</span>
            <Input
              name="name"
              value={formik.values.name}
              placeholder="Họ tên"
              onChange={formik.handleChange}
            ></Input>
          </div>

          <div className={Style.content}>
            <span>Số điện thoại</span>
            <Input
              name="phone"
              value={formik.values.phone}
              placeholder="Số điện thoại"
              onChange={formik.handleChange}
            ></Input>
          </div>

          <div className={Style.content}>
            <span>Ngày sinh</span>
            <DatePicker
              name="birthday"
              value={moment(formik.values.birthday, "DD/MM/YYYY")}
              style={{
                width: "100%",
              }}
              format="DD/MM/YYYY"
              onChange={handleChangeBirthday}
            />
          </div>

          <div className={Style.content}>
            <span>Nam</span>
            <Switch
              checked={formik.values.gender}
              onChange={handleChangeGender}
            />
          </div>

          <div className={Style.content}>
            <span>Phân quyền</span>
            <Select
              name="role"
              value={formik.values.role}
              style={{
                width: "100%",
              }}
              onChange={handleChangeRole}
            >
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </div>

          <div className={Style.content}>
            <span>Kỹ năng</span>
            <Input.Group
              compact={false}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input
                ref={txtSkill}
                style={{
                  width: "85%",
                }}
                placeholder="Tên kỹ năng"
              />
              <Button type="primary" htmlType="button" onClick={handleAddSkill}>
                Thêm
              </Button>
            </Input.Group>
            <table className={Style.list}>
              <tbody>{renderSkillList(formik.values.skill)}</tbody>
            </table>
          </div>

          <div className={Style.content}>
            <span>Chứng chỉ</span>
            <Input.Group
              compact={false}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input
                ref={txtCertification}
                style={{
                  width: "85%",
                }}
                placeholder="Tên chứng chỉ"
              />
              <Button
                type="primary"
                htmlType="button"
                onClick={handleAddCertification}
              >
                Thêm
              </Button>
            </Input.Group>
            <table className={Style.list}>
              <tbody>
                {renderCertificationList(formik.values.certification)}
              </tbody>
            </table>
          </div>

          <div className={Style.btnGroup}>
            <Button
              type="ghost"
              onClick={() => {
                props.handleCloseUpdateModal();
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

export default UserUpdateForm;
