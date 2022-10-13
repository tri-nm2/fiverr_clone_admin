import { Input, Rate } from "antd";
import React from "react";
import Style from "./style.module.css";

function JobDetail(props) {
  const selectedJob = props.selectedJob;
  const createUser = props.createUser;
  return (
    <div className={Style.detail}>
      <div className={Style.content}>
        <span>Id</span>
        <Input value={selectedJob.id} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Tên công việc</span>
        <Input value={selectedJob.tenCongViec} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Đánh giá</span>
        <Input value={selectedJob.danhGia} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Giá tiền</span>
        <Input value={selectedJob.giaTien} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Người tạo</span>
        <Input value={createUser.name} disabled></Input>
      </div>

      <div className={Style.content}>
        <span>Hình ảnh</span>
        <div className={Style.thumbnail}>
          <img src={selectedJob.hinhAnh} alt="error" />
        </div>
      </div>

      <div className={Style.content}>
        <span>Mô tả</span>
        <Input.TextArea
          rows={6}
          value={selectedJob.moTa}
          disabled
          style={{ resize: "none" }}
        />
      </div>

      <div className={Style.content}>
        <span>Mô tả ngắn</span>
        <Input.TextArea
          rows={4}
          value={selectedJob.moTaNgan}
          disabled
          style={{ resize: "none" }}
        />
      </div>

      <div className={Style.content}>
        <span>Sao công việc</span>
        <Rate value={selectedJob.saoCongViec} allowHalf disabled />
      </div>
    </div>
  );
}

export default JobDetail;
