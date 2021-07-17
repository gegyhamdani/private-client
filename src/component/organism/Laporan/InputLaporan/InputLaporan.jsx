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
import moment from "moment";

import Checkbox from "antd/lib/checkbox/Checkbox";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";

const config = {
  rules: [
    {
      type: "object",
      message: "Tolong pilih tanggal"
    }
  ]
};

const InputLaporan = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const nameUser = useSelector(state => state.auth.name);
  const userId = useSelector(state => state.auth.userId);

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

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

  const openNotificationFormCheckboxError = errMsg => {
    notification.error({
      message: `Pilih minimal 1 ${errMsg}`,
      duration: 2
    });
  };

  const saveLaporan = values => {
    const { name, date, kegiatan, tahapan, keterangan, foto, keluhan } = values;
    return laporanAPI.saveLaporan(
      name,
      date,
      kegiatan,
      tahapan,
      keterangan,
      foto,
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

    const prosesPemetaan = { prosesPemetaan: fields.prosespemetaan || false };
    const selesaiPemetaan = {
      selesaiPemetaan: fields.selesaipemetaan || false
    };
    const prosesPenyuluhan = {
      prosesPenyuluhan: fields.prosespenyuluhan || false
    };
    const selesaiPenyuluhan = {
      selesaiPenyuluhan: fields.selesaipenyuluhan || false
    };

    if (
      !fields.koordinasi &&
      !fields.kunjungan &&
      !fields.meeting &&
      !fields.penampingan &&
      !fields.lainnya
    )
      return openNotificationFormCheckboxError("kegiatan");

    if (
      !fields.prosespemetaan &&
      !fields.selesaipemetaan &&
      !fields.prosespenyuluhan &&
      !fields.selesaipenyuluhan
    )
      return openNotificationFormCheckboxError("tahapan");

    const kegiatan = [koordinasi, kunjungan, meeting, pendampingan, lainnya];
    const tahapan = [
      prosesPemetaan,
      selesaiPemetaan,
      prosesPenyuluhan,
      selesaiPenyuluhan
    ];
    const convertedKegiatan = JSON.stringify(kegiatan);
    const convertedTahapan = JSON.stringify(tahapan);

    const values = {
      keluhan: fields.keluhan !== undefined ? fields.keluhan[0].keluhan : "",
      name: fields.name,
      date: fields.date.format("YYYY-MM-DD"),
      kegiatan: convertedKegiatan,
      tahapan: convertedTahapan,
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

        <Form.Item name="date" label="TANGGAL" labelAlign="left" {...config}>
          <DatePicker disabled />
        </Form.Item>

        <div className={styles["form__checkbox--group"]}>
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

          <Form.Item label="TAHAPAN AKSES REFORMA">
            <Form.Item name="prosespemetaan" valuePropName="checked">
              <Checkbox>Proses Pemetaan</Checkbox>
            </Form.Item>
            <Form.Item name="selesaipemetaan" valuePropName="checked">
              <Checkbox>Selesai Pemetaan</Checkbox>
            </Form.Item>
            <Form.Item name="prosespenyuluhan" valuePropName="checked">
              <Checkbox>Proses Penyuluhan</Checkbox>
            </Form.Item>
            <Form.Item name="selesaipenyuluhan" valuePropName="checked">
              <Checkbox>Selesai Penyuluhan</Checkbox>
            </Form.Item>
          </Form.Item>
        </div>

        <Form.Item
          name="keterangan"
          label="KETERANGAN"
          labelAlign="left"
          rules={[
            {
              message: "Tolong masukan keterangan",
              required: true
            }
          ]}
        >
          <Input.TextArea />
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
                      <Input.TextArea />
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
