/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, DatePicker, Form, Input, notification } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import users from "../../../../constant/user";

const { TextArea } = Input;

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Tolong pilih tanggal"
    }
  ]
};

const InputFieldStaff = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const userId = useSelector(state => state.auth.userId);

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data fieldstaff berhasil ditambahkan",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: `Data fieldstaff gagal ditambahkan${
        errMsg ? `, ${errMsg}` : ""
      }`,
      duration: 2
    });
  };

  const saveFieldstaff = values => {
    const { name, date, alamat, phone, username, password } = values;
    return fieldstaffAPI.saveFieldstaff(
      name,
      date,
      alamat,
      phone,
      username,
      password,
      users.Fieldstaff,
      userId
    );
  };

  const onFinish = field => {
    const values = {
      ...field,
      date: field.date.format("YYYY-MM-DD")
    };

    saveFieldstaff(values)
      .then(() => {
        openNotificationSuccess(() => {
          form.resetFields();
          router.push("/datafieldstaff");
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
        className={styles.login__form}
        layout="vertical"
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
          name="date"
          label="TANGGAL LAHIR"
          labelAlign="left"
          {...config}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="alamat"
          label="ALAMAT"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan alamat"
            }
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          name="phone"
          label="NO. TELEPON"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan no.telepon"
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

export default InputFieldStaff;
