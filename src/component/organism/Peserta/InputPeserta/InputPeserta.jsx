/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, DatePicker, Form, Input } from "antd";

import styles from "./index.module.css";

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Tolong pilih tanggal"
    }
  ]
};

const InputPeserta = () => {
  const onFinish = values => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className={styles.container}>
      <Form
        name="input-fieldstaff"
        className={styles.container__form}
        layout="vertical"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="nik"
          label="NIK"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan nik"
            }
          ]}
        >
          <Input />
        </Form.Item>

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
          name="bidang"
          label="JUMLAH BIDANG"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan jumlah bidang"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="location"
          label="LOKASI"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan lokasi"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="model"
          label="MODEL PEMBERDAYAAN"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan model pemberdayaan"
            }
          ]}
          hasFeedback
        >
          <Input />
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

export default InputPeserta;
