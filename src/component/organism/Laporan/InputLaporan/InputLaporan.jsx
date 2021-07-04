/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, DatePicker, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import Checkbox from "antd/lib/checkbox/Checkbox";
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

const InputLaporan = () => {
  const normFile = e => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const onFinish = values => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className={styles.container}>
      <Form
        name="input-fieldstaff"
        className={styles.login__form}
        layout="vertical"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="NAMA FS"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan nama"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="date" label="TANGGAL" labelAlign="left" {...config}>
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="location"
          label="LOKASI PEMBERDAYAAN"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan lokasi pemberdayaan"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="KEGIATAN">
          <Form.Item name="koordinasi" valuePropName="checked">
            <Checkbox>Koordinasi dengan kantah</Checkbox>
          </Form.Item>
          <Form.Item name="pendampingan" valuePropName="checked">
            <Checkbox>Melakukan Pendampingan</Checkbox>
          </Form.Item>
          <Form.Item name="meeting" valuePropName="checked">
            <Checkbox>Rapat/Meeting</Checkbox>
          </Form.Item>
          <Form.Item name="kunjungan" valuePropName="checked">
            <Checkbox>Melakukan Kunjungan</Checkbox>
          </Form.Item>
          <Form.Item name="other" valuePropName="checked">
            <Checkbox>Lainnya</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="keterangan"
          label="KETERANGAN"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan keterangan"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="upload"
          label="UPLOAD FOTO"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
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

export default InputLaporan;
