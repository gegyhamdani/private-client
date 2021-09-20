/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, DatePicker, Form, Input, notification } from "antd";

import moment from "moment";

import styles from "./index.module.css";
import rencanaAPI from "../../../../api/rencanaAPI";

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
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const nameUser = useSelector(state => state.auth.name);
  const userId = useSelector(state => state.auth.userId);

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data laporan berhasil ditambahkan",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: `Data laporan gagal ditambahkan${errMsg ? `, ${errMsg}` : ""}`,
      duration: 2
    });
  };

  const saveLaporan = values => {
    const { name, date, lokasi, tindak } = values;

    return rencanaAPI.saveRencana(name, date, lokasi, tindak, userId);
  };

  const onFinish = fields => {
    setLoading(true);
    const values = {
      ...fields,
      date: fields.date.format("YYYY-MM-DD")
    };

    return saveLaporan(values)
      .then(() => {
        openNotificationSuccess(() => {
          form.resetFields();
          router.push("/datarencana");
        });
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            openNotificationError("Laporan error");
          } else {
            openNotificationError();
          }
        }
      })
      .finally(() => setLoading(false));
  };

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
        <Form.Item name="name" label="NAMA FIELDSTAFF" labelAlign="left">
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
          name="tindak"
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
