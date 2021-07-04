/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, DatePicker, Form, Input, Upload, notification } from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";

import Checkbox from "antd/lib/checkbox/Checkbox";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";

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

const InputLaporan = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const username = useSelector(state => state.auth.username);
  const userId = useSelector(state => state.auth.userId);

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data fieldstaff berhasil ditambahkan",
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

  const openNotificationFormError = () => {
    notification.error({
      message: `Pilih minimal 1 kegiatan`,
      duration: 2
    });
  };

  const saveLaporan = values => {
    const {
      name,
      date,
      kegiatan,
      keterangan,
      foto,
      location,
      keluhan
    } = values;
    return laporanAPI.saveLaporan(
      name,
      date,
      kegiatan,
      keterangan,
      foto,
      location,
      keluhan,
      "",
      userId
    );
  };

  const onFinish = fields => {
    const koordinasi = { koordinasi: fields.koordinasi || false };
    const kunjungan = { kunjungan: fields.kunjungan || false };
    const meeting = { meeting: fields.meeting || false };
    const pendampingan = { pendampingan: fields.pendampingan || false };
    const lainnya = { lainnya: fields.lainnya || false };

    if (
      !fields.koordinasi &&
      !fields.kunjungan &&
      !fields.meeting &&
      !fields.penampingan &&
      !fields.lainnya
    )
      return openNotificationFormError();

    const kegiatan = [koordinasi, kunjungan, meeting, pendampingan, lainnya];
    const convertedKegiatan = JSON.stringify(kegiatan);

    const values = {
      keluhan: fields.keluhan !== undefined ? fields.keluhan[0].keluhan : "",
      name: fields.name,
      date: fields.date.format("YYYY-MM-DD"),
      kegiatan: convertedKegiatan,
      location: fields.location,
      keterangan: fields.keterangan,
      foto: fields.upload
    };

    return saveLaporan(values)
      .then(() => {
        openNotificationSuccess(() => {
          form.resetFields();
          router.push("/datalaporan");
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
      });
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="input-fieldstaff"
        className={styles.login__form}
        layout="vertical"
        initialValues={{
          remember: true,
          name: username
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
          <Input disabled />
        </Form.Item>

        <Form.Item name="date" label="TANGGAL" labelAlign="left" {...config}>
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="location"
          label="LOKASI PEMBERDAYAAN"
          labelAlign="left"
          required
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
          <Form.Item name="lainnya" valuePropName="checked">
            <Checkbox>Lainnya</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="keterangan"
          label="KETERANGAN"
          labelAlign="left"
          required
          rules={[
            {
              message: "Tolong masukan keterangan"
            }
          ]}
        >
          <TextArea />
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

        <Form.List name="keluhan">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className={styles["form__keluhan--container"]}>
                    <Form.Item
                      {...restField}
                      {...restField}
                      name={[name, "keluhan"]}
                      fieldKey={[fieldKey, "keluhan"]}
                      label="KELUHAN"
                      labelAlign="left"
                      className={styles.form__keluhan}
                    >
                      <TextArea />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    disabled={fields.length >= 1}
                  >
                    Tambah keluhan
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

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
