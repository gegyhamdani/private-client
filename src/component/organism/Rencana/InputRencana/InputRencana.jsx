/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, DatePicker, Form, Input } from "antd";

import moment from "moment";

import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";

const config = {
  rules: [
    {
      type: "object",
      message: "Tolong pilih tanggal"
    }
  ]
};

const dateFormat = "MM - yyyy";

const InputRencana = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const nameUser = useSelector(state => state.auth.name);
  const userId = useSelector(state => state.auth.userId);

  const onFinish = fields => {
    console.log({ fields });
  };

  useEffect(() => {
    if (userId) {
      fieldstaffAPI.getFieldstaff(userId).then(res => {
        setUserData(res);
      });
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="input-fieldstaff"
        className={styles.container__form}
        layout="vertical"
        initialValues={{
          remember: true,
          name: nameUser,
          date: moment()
        }}
        onFinish={onFinish}
      >
        <Form.Item name="name" label="NAMA FS" labelAlign="left">
          <Input disabled />
        </Form.Item>

        <Form.Item name="date" label="PERIODE" labelAlign="left" {...config}>
          <DatePicker
            style={{ width: "50%" }}
            format={dateFormat}
            picker="month"
          />
        </Form.Item>

        <Form.Item
          name="lokasi"
          label="LOKASI"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan lokasi",
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rencana"
          label="RENCANA TINDAK LANJUT"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan rencana tindak lanjut",
              required: true
            }
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            SIMPAN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputRencana;
