/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, Form, Input, notification } from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import locationAPI from "../../../../api/locationAPI";

const InputLokasi = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data lokasi berhasil ditambahkan",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = () => {
    notification.success({
      message: "Data lokasi gagal ditambahkan",
      duration: 2
    });
  };

  const saveLocation = values => {
    const { desa, kecamatan, kota, provinsi } = values;
    return locationAPI.saveLocation(desa, kecamatan, kota, provinsi);
  };

  const onFinish = field => {
    saveLocation(field)
      .then(() => {
        openNotificationSuccess(() => {
          form.resetFields();
          router.push("/datalokasi");
        });
      })
      .catch(() => openNotificationError());
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="input-location"
        className={styles.container__form}
        layout="vertical"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="desa"
          label="DESA"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan desa"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="kecamatan"
          label="KECAMATAN"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan kecamatan"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="kota"
          label="KABUPATEN/KOTA"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan kabupaten/kota"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="provinsi"
          label="PROVINSI"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Tolong masukan provinsi"
            }
          ]}
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

export default InputLokasi;
