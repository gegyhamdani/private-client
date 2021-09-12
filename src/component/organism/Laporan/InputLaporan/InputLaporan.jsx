/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Upload,
  notification,
  Select
} from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import moment from "moment";

import Checkbox from "antd/lib/checkbox/Checkbox";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import axiosInstance from "../../../../api/axiosInstance";

const config = {
  rules: [
    {
      type: "object",
      message: "Tolong pilih tanggal"
    }
  ]
};

const dateFormat = "DD - MM - yyyy";

const InputLaporan = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [imageId, setImageId] = useState([]);
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
    setLoading(false);
  };

  const openNotifUploadError = () => {
    notification.error({
      message: `Gagal upload foto`,
      duration: 2
    });
  };

  const uploadProps = {
    name: "image",
    action: `${axiosInstance.apiUrl}/${axiosInstance.routes.image()}`,
    listType: "picture",
    accept: "image/png, image/jpeg, image/jpg",
    onChange(info) {
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        const { id } = info.file.response;
        setLoading(false);
        setImageId(prevArray => [...prevArray, id]);
      } else if (info.file.status === "error") {
        setLoading(false);
        openNotifUploadError();
      } else if (info.file.status === "removed") {
        const { id } = info.file.response;
        setImageId(prevArray => prevArray.filter(item => item !== id));
      }
    }
  };

  const saveLaporan = values => {
    const {
      name,
      date,
      inputDate,
      kegiatan,
      tahapan,
      keterangan,
      peserta,
      foto,
      keluhan
    } = values;
    return laporanAPI.saveLaporan(
      name,
      date,
      inputDate,
      kegiatan,
      tahapan,
      keterangan,
      peserta,
      foto,
      keluhan,
      "",
      userId
    );
  };

  const checkTahapan = (data, field) => {
    if (userData[data] === null || userData[data] === false) {
      if (field !== undefined) {
        return field.includes(data);
      }
      return false;
    }
    return userData[data];
  };

  const onFinish = fields => {
    setLoading(true);
    const koordinasi = { koordinasi: fields.koordinasi || false };
    const kunjungan = { kunjungan: fields.kunjungan || false };
    const meeting = { meeting: fields.meeting || false };
    const pendampingan = { pendampingan: fields.pendampingan || false };
    const lainnya = { lainnya: fields.lainnya || false };
    if (
      !fields.koordinasi &&
      !fields.kunjungan &&
      !fields.meeting &&
      !fields.pendampingan &&
      !fields.lainnya
    )
      return openNotificationFormCheckboxError("kegiatan");

    const kegiatan = [koordinasi, kunjungan, meeting, pendampingan, lainnya];
    const convertedKegiatan = JSON.stringify(kegiatan);

    const convertedTahapan = JSON.stringify(fields.tahapan);

    const pemetaan = checkTahapan("pemetaan", fields.tahapan);
    const penyuluhan = checkTahapan("penyuluhan", fields.tahapan);
    const penyusunan = checkTahapan("penyusunan", fields.tahapan);
    const pendampinganTahapan = checkTahapan("pendampingan", fields.tahapan);
    const evaluasi = checkTahapan("evaluasi", fields.tahapan);

    const values = {
      keluhan: fields.keluhan !== undefined ? fields.keluhan[0].keluhan : "",
      name: fields.name,
      date: fields.date.format("YYYY-MM-DD"),
      inputDate: moment().format("YYYY-MM-DD"),
      kegiatan: convertedKegiatan,
      tahapan: convertedTahapan,
      keterangan: fields.keterangan,
      peserta: fields.peserta,
      foto: JSON.stringify(imageId)
    };

    return saveLaporan(values)
      .then(() => {
        fieldstaffAPI
          .updateFieldstaff(
            userId,
            userData.name,
            userData.alamat,
            userData.phone_number,
            userData.target,
            userData.username,
            userData.password,
            pemetaan,
            penyuluhan,
            penyusunan,
            pendampinganTahapan,
            evaluasi
          )
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
          })
          .finally(() => setLoading(false));
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

        <Form.Item name="date" label="TANGGAL" labelAlign="left" {...config}>
          <DatePicker style={{ width: "50%" }} format={dateFormat} />
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

          <div style={{ display: "none" }}>
            <Form.Item name="tahapan" label="TAHAPAN AKSES REFORMA">
              <Select
                mode="multiple"
                allowClear
                placeholder="Pilih tahapan akses reforma"
                style={{ width: "220px" }}
              >
                <Select.Option value="pemetaan" disabled={userData.pemetaan}>
                  Pemetaan Sosial
                </Select.Option>
                <Select.Option
                  value="penyuluhan"
                  disabled={userData.penyuluhan}
                >
                  Penyuluhan
                </Select.Option>
                <Select.Option
                  value="penyusunan"
                  disabled={userData.penyusunan}
                >
                  Penyusunan Model
                </Select.Option>
                <Select.Option
                  value="pendampingan"
                  disabled={userData.pendampingan}
                >
                  Pendampingan
                </Select.Option>
                <Select.Option value="evauasi" disabled={userData.evaluasi}>
                  Evaluasi dan Pelaporan
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
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

        <Form.Item name="peserta" label="PESERTA" labelAlign="left">
          <Input />
        </Form.Item>

        <Form.Item
          name="upload"
          label="UPLOAD FOTO"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload {...uploadProps}>
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            SIMPAN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputLaporan;
