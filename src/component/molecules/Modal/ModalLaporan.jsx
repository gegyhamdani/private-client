import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import { Modal, Button, Form, Input, notification, Select, Spin } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

import laporanAPI from "../../../api/laporanAPI";
import users from "../../../constant/user";

import styles from "./index.module.css";
import dateHelper from "../../../helpers/dateHelper";
import imageAPI from "../../../api/imageAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ModalLaporan = ({ id, isModalVisible, onCloseModal }) => {
  const [dataLaporan, setDataLaporan] = useState({});
  const [image, setImage] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const userLevel = useSelector(state => state.auth.level);
  const router = useRouter();

  const handleCancel = () => {
    setDataLaporan({});
    setImage([]);
    onCloseModal();
  };

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data laporan berhasil diupdate",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: `Data laporan gagal diupdate${errMsg ? `, ${errMsg}` : ""}`,
      duration: 2
    });
  };

  const openNotificationFormCheckboxError = errMsg => {
    notification.error({
      message: `Pilih minimal 1 ${errMsg}`,
      duration: 2
    });
  };

  const updateLaporan = values => {
    const {
      kegiatan,
      tahapan,
      keterangan,
      peserta,
      foto,
      keluhan,
      saran
    } = values;
    return laporanAPI.updateLaporan(
      dataLaporan.id,
      kegiatan,
      tahapan,
      keterangan,
      peserta,
      foto,
      keluhan,
      saran
    );
  };

  const handleFinish = fields => {
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
      return openNotificationFormCheckboxError("kegiatan");

    const kegiatan = [koordinasi, kunjungan, meeting, pendampingan, lainnya];
    const convertedKegiatan = JSON.stringify(kegiatan);

    const convertedTahapan = JSON.stringify(fields.tahapan);

    const values = {
      keluhan: fields.keluhan,
      name: fields.name,
      date: dataLaporan.tanggal_laporan,
      kegiatan: convertedKegiatan,
      tahapan: convertedTahapan,
      keterangan: fields.keterangan,
      peserta: fields.peserta,
      foto: fields.upload,
      saran: fields.saran
    };

    return updateLaporan(values)
      .then(() => {
        openNotificationSuccess(() => {
          router.reload();
        });
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            openNotificationError("Update Error");
          } else {
            openNotificationError();
          }
        }
      });
  };

  const getPhoto = async photo => {
    const dataPhoto = photo.map(async item => {
      const apiResult = await imageAPI.getImage(item);
      // eslint-disable-next-line new-cap
      return new Buffer.from(apiResult.img.data).toString("base64");
    });
    const photoResult = await Promise.all(dataPhoto);
    setImage(photoResult);
    setLoadingImage(false);
  };

  useEffect(() => {
    if (id) {
      laporanAPI.getLaporan(id).then(res => setDataLaporan(res));
    }
  }, [id]);

  useEffect(() => {
    if (!isEmpty(dataLaporan)) {
      setLoadingImage(true);
      if (dataLaporan.foto !== undefined) {
        const parse = JSON.parse(dataLaporan.foto);
        getPhoto(parse);
      } else if (dataLaporan.foto !== undefined) {
        setLoadingImage(false);
      }
    }
  }, [dataLaporan]);

  const getDate = () => {
    if (!isEmpty(dataLaporan)) {
      return dateHelper.convertDate(dataLaporan.tanggal_laporan);
    }
    return 0;
  };

  const getDateInput = () => {
    if (!isEmpty(dataLaporan)) {
      return dateHelper.convertDate(dataLaporan.tanggal_input);
    }
    return 0;
  };

  const getKoordinasi = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      const kegiatanKoordinasi = find(kegiatan, o => o.koordinasi);
      if (kegiatanKoordinasi) {
        return kegiatanKoordinasi.koordinasi;
      }
      return false;
    }
    return 0;
  };

  const getPendampingan = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      const kegiatanPendampingan = find(kegiatan, o => o.pendampingan);
      if (kegiatanPendampingan) {
        return kegiatanPendampingan.pendampingan;
      }
      return false;
    }
    return 0;
  };

  const getMeeting = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      const kegiatanMeeting = find(kegiatan, o => o.meeting);
      if (kegiatanMeeting) {
        return kegiatanMeeting.meeting;
      }
      return false;
    }
    return 0;
  };

  const getKunjungan = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      const kegiatanKunjungan = find(kegiatan, o => o.kunjungan);
      if (kegiatanKunjungan) {
        return kegiatanKunjungan.kunjungan;
      }
      return false;
    }
    return 0;
  };

  const getLainnya = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      const kegiatanLainnya = find(kegiatan, o => o.lainnya);
      if (kegiatanLainnya) {
        return kegiatanLainnya.lainnya;
      }
      return false;
    }
    return 0;
  };

  const getTahapan = () => {
    if (!isEmpty(dataLaporan)) {
      const tahapan = JSON.parse(dataLaporan.tahapan);
      return tahapan;
    }
    return 0;
  };

  const getImage = () => {
    if (loadingImage) {
      return <Spin indicator={antIcon} />;
    }
    if (!loadingImage) {
      if (image.length > 0) {
        return image.map((val, i) => (
          <img
            src={`data:image/png;base64,${val}`}
            alt=""
            key={i.toString()}
            className={styles.img}
          />
        ));
      }
      return <p className={styles.info}>Tidak ada foto yang di upload</p>;
    }
    return <></>;
  };

  return (
    <>
      <Modal
        title="Detail Laporan"
        visible={isModalVisible}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={null}
      >
        {!isEmpty(dataLaporan) && (
          <>
            <Form
              name="edit-laporan"
              layout="vertical"
              initialValues={{
                name: dataLaporan.fieldstaff_name,
                date: getDate(),
                inputDate: getDateInput(),
                keterangan: dataLaporan.keterangan,
                peserta: dataLaporan.peserta,
                keluhan: dataLaporan.keluhan,
                koordinasi: getKoordinasi(),
                pendampingan: getPendampingan(),
                meeting: getMeeting(),
                kunjungan: getKunjungan(),
                lainnya: getLainnya(),
                tahapan: getTahapan(),
                saran: dataLaporan.saran
              }}
              onFinish={handleFinish}
            >
              <Form.Item name="name" label="NAMA FIELDSTAFF" labelAlign="left">
                <Input disabled />
              </Form.Item>

              <Form.Item name="date" label="TANGGAL LAPORAN" labelAlign="left">
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="inputDate"
                label="TANGGAL INPUT"
                labelAlign="left"
              >
                <Input disabled />
              </Form.Item>

              <div className={styles["form__checkbox--group"]}>
                <Form.Item label="KEGIATAN">
                  <Form.Item name="koordinasi" valuePropName="checked">
                    <Checkbox
                      disabled={
                        userLevel === users.Kantah || userLevel === users.Kanwil
                      }
                    >
                      Koordinasi dengan kantah
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="pendampingan" valuePropName="checked">
                    <Checkbox
                      disabled={
                        userLevel === users.Kantah || userLevel === users.Kanwil
                      }
                    >
                      Melakukan Pendampingan
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="meeting" valuePropName="checked">
                    <Checkbox
                      disabled={
                        userLevel === users.Kantah || userLevel === users.Kanwil
                      }
                    >
                      Rapat/Meeting
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="kunjungan" valuePropName="checked">
                    <Checkbox
                      disabled={
                        userLevel === users.Kantah || userLevel === users.Kanwil
                      }
                    >
                      Melakukan Kunjungan
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="lainnya" valuePropName="checked">
                    <Checkbox
                      disabled={
                        userLevel === users.Kantah || userLevel === users.Kanwil
                      }
                    >
                      Lainnya
                    </Checkbox>
                  </Form.Item>
                </Form.Item>

                <div style={{ display: "none" }}>
                  <Form.Item name="tahapan" label="TAHAPAN AKSES REFORMA">
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Pilih tahapan akses reforma"
                      style={{ width: "220px" }}
                      disabled
                    >
                      <Select.Option value="pemetaan" disabled>
                        Pemetaan Sosial
                      </Select.Option>
                      <Select.Option value="penyuluhan" disabled>
                        Penyuluhan
                      </Select.Option>
                      <Select.Option value="penyusunan" disabled>
                        Penyusunan Model
                      </Select.Option>
                      <Select.Option value="pendampingan" disabled>
                        Pendampingan
                      </Select.Option>
                      <Select.Option value="evauasi" disabled>
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
                <Input.TextArea
                  disabled={
                    userLevel === users.Kantah || userLevel === users.Kanwil
                  }
                />
              </Form.Item>

              <Form.Item name="peserta" label="PESERTA" labelAlign="left">
                <Input.TextArea
                  disabled={
                    userLevel === users.Kantah || userLevel === users.Kanwil
                  }
                />
              </Form.Item>

              <Form.Item
                name="keluhan"
                fieldKey="keluhan"
                label="KELUHAN"
                labelAlign="left"
              >
                <Input.TextArea
                  disabled={
                    userLevel === users.Kantah || userLevel === users.Kanwil
                  }
                />
              </Form.Item>

              <Form.Item
                name="saran"
                fieldKey="saran"
                label="SARAN"
                labelAlign="left"
              >
                <Input.TextArea disabled={userLevel === users.Fieldstaff} />
              </Form.Item>

              <Form.Item
                name="foto"
                fieldKey="saran"
                label="Foto"
                labelAlign="left"
              >
                <div className={styles["img--container"]}>{getImage()}</div>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  UPDATE
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

ModalLaporan.propTypes = {
  id: PropTypes.number,
  isModalVisible: PropTypes.bool,
  onCloseModal: PropTypes.func
};

ModalLaporan.defaultProps = {
  id: 0,
  isModalVisible: false,
  onCloseModal: () => {}
};

export default ModalLaporan;
