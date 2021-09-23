import React, { useState, useEffect, useRef } from "react";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Form, Input, Spin, notification, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import tahapanAPI from "../../../../api/tahapanAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const InputTahapan = () => {
  const [userData, setUserData] = useState({});
  const [tahapanData, setTahapanData] = useState({});
  const [isLoadUser, setLoadUser] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const nameUser = useSelector(state => state.auth.name);
  const userId = useSelector(state => state.auth.userId);
  const formRef = useRef();

  const openNotifTarget = () => {
    notification.success({
      message: "Mohon isi Target terlebih dahulu",
      duration: 2
    });
  };

  const openNotifError = errMsg => {
    notification.error({
      message: `${errMsg}`,
      duration: 2
    });
    setLoading(false);
  };

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data tahapan berhasil ditambahkan",
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

  const updateTahapan = value => {
    const pemetaan =
      value.tahapan === "pemetaan"
        ? value.target_tahapan
        : tahapanData.pemetaan;
    const penyuluhan =
      value.tahapan === "penyuluhan"
        ? value.target_tahapan
        : tahapanData.penyuluhan;
    const penyusunan =
      value.tahapan === "penyusunan"
        ? value.target_tahapan
        : tahapanData.penyusunan;
    const pendampingan =
      value.tahapan === "pendampingan"
        ? value.target_tahapan
        : tahapanData.pendampingan;
    const evaluasi =
      value.tahapan === "evaluasi"
        ? value.target_tahapan
        : tahapanData.evaluasi;

    return tahapanAPI.updateTahapan(
      tahapanData.id,
      pemetaan,
      penyuluhan,
      penyusunan,
      pendampingan,
      evaluasi
    );
  };

  const saveTahapan = value => {
    const { name } = value;
    const pemetaan = value.tahapan === "pemetaan" ? value.target_tahapan : 0;
    const penyuluhan =
      value.tahapan === "penyuluhan" ? value.target_tahapan : 0;
    const penyusunan =
      value.tahapan === "penyusunan" ? value.target_tahapan : 0;
    const pendampingan =
      value.tahapan === "pendampingan" ? value.target_tahapan : 0;
    const evaluasi = value.tahapan === "evaluasi" ? value.target_tahapan : 0;

    return tahapanAPI.saveTahapan(
      name,
      pemetaan,
      penyuluhan,
      penyusunan,
      pendampingan,
      evaluasi,
      userId
    );
  };

  const onFinish = fields => {
    setLoading(true);

    const targetValue = parseInt(fields.target_tahapan, 10);
    if (targetValue > userData.target) {
      openNotifError(`Maksimum target adalah ${userData.target}`);
    } else {
      const value = {
        ...fields,
        target_tahapan: targetValue
      };

      if (isEmpty(tahapanData)) {
        saveTahapan(value)
          .then(() => {
            openNotificationSuccess(() => {
              form.resetFields();
              router.push("/datatahapan");
            });
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 401) {
                openNotificationError("Tahapan error");
              } else {
                openNotificationError();
              }
            }
          })
          .finally(() => setLoading(false));
      } else {
        updateTahapan(value)
          .then(() => {
            openNotificationSuccess(() => {
              form.resetFields();
              router.push("/datatahapan");
            });
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 401) {
                openNotificationError("Tahapan error");
              } else {
                openNotificationError();
              }
            }
          })
          .finally(() => setLoading(false));
      }
    }
  };

  const handleChangeTahapan = e => {
    formRef.current.setFieldsValue({
      target_realisasi: tahapanData[e] || 0
    });
  };

  useEffect(() => {
    if (userId) {
      setLoadUser(true);
      fieldstaffAPI
        .getFieldstaff(userId)
        .then(res => {
          return setUserData(res);
        })
        .then(() => {
          return tahapanAPI.getUserTahapan(userId);
        })
        .then(res => {
          const tahapan = { ...res[0] };
          setTahapanData(tahapan);
        })
        .finally(() => setLoadUser(false));
    }
  }, [userId]);

  useEffect(() => {
    if (!isEmpty(userData)) {
      if (userData.target === 0 || userData.target === undefined) {
        setDisableSubmit(true);
        openNotifTarget();
      }
    }
  }, [userData]);

  return (
    <div className={styles.container}>
      {isLoadUser ? (
        <Spin
          indicator={antIcon}
          style={{ marginTop: "5em", marginLeft: "15em" }}
        />
      ) : (
        <>
          <Form
            form={form}
            name="input-fieldstaff"
            className={styles.container__form}
            layout="vertical"
            ref={formRef}
            initialValues={{
              remember: true,
              name: nameUser,
              target: userData.target
            }}
            onFinish={onFinish}
          >
            <div className={styles.row}>
              <Form.Item
                name="name"
                label="NAMA FIELDSTAFF"
                labelAlign="left"
                className={styles.item}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="target"
                label="TARGET FISIK (KK)"
                labelAlign="left"
                className={styles.item}
              >
                <Input disabled />
              </Form.Item>
            </div>

            <Form.Item
              name="tahapan"
              label="TAHAPAN AKSES REFORMA AGRARIA"
              rules={[
                {
                  required: true,
                  message: "Tolong pilih tahapan"
                }
              ]}
            >
              <Select
                allowClear
                placeholder="Pilih tahapan akses reforma"
                style={{ width: "220px" }}
                onChange={handleChangeTahapan}
              >
                <Select.Option value="pemetaan">Pemetaan Sosial</Select.Option>
                <Select.Option value="penyuluhan">Penyuluhan</Select.Option>
                <Select.Option value="penyusunan">
                  Penyusunan Model
                </Select.Option>
                <Select.Option value="pendampingan">Pendampingan</Select.Option>
                <Select.Option value="evaluasi">
                  Evaluasi dan Pelaporan
                </Select.Option>
              </Select>
            </Form.Item>

            <div className={styles.row}>
              <Form.Item
                name="target_tahapan"
                label="REALISASI FISIK"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Tolong masukan target"
                  },
                  {
                    pattern: /^(?:\d*)$/,
                    message: "Hanya boleh diisi angka"
                  }
                ]}
                className={styles.item}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="target_realisasi"
                label="REALISASI YANG SUDAH DI INPUT"
                labelAlign="left"
                className={styles.item}
              >
                <Input disabled />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disableSubmit}
                loading={isLoading}
              >
                SIMPAN
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default InputTahapan;
