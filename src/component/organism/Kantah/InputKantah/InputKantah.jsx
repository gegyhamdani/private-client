/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, Form, Input, notification } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import kantahAPI from "../../../../api/kantahAPI";
import users from "../../../../constant/user";

const InputKantah = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const userId = useSelector(state => state.auth.userId);

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data kantah berhasil ditambahkan",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: `Data kantah gagal ditambahkan${errMsg ? `, ${errMsg}` : ""}`,
      duration: 2
    });
  };

  const saveKantah = values => {
    const { name, username, email, head, nip, password } = values;
    return kantahAPI.saveKantah(
      name,
      username,
      password,
      email,
      head,
      nip,
      users.Kantah,
      userId
    );
  };

  const onFinish = field => {
    saveKantah(field)
      .then(() => {
        openNotificationSuccess(() => {
          form.resetFields();
          router.push("/datakantah");
        });
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            openNotificationError("Username telah digunakan");
          } else {
            openNotificationError();
          }
        }
      });
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="input-fieldstaff"
        className={styles.container__form}
        layout="vertical"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="NAMA"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan nama"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="username"
          label="USERNAME"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan username"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="EMAIL"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan email"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="head"
          label="NAMA KEPALA KANTOR"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan nama kepala kantor"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="nip"
          label="NIP KEPALA KANTOR"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan NIP"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="PASSWORD"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan password"
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            SIMPAN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputKantah;
