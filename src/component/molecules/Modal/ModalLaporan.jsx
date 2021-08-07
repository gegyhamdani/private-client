import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import { Modal, Button, Form, Input, notification } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useRouter } from "next/router";

import laporanAPI from "../../../api/laporanAPI";
import users from "../../../constant/user";

import styles from "./index.module.css";
import dateHelper from "../../../helpers/dateHelper";

const ModalLaporan = ({ id, isModalVisible, onCloseModal }) => {
  const [dataLaporan, setDataLaporan] = useState({});
  const userLevel = useSelector(state => state.auth.level);
  const router = useRouter();

  const handleCancel = () => {
    setDataLaporan({});
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
    const { kegiatan, tahapan, keterangan, foto, keluhan, saran } = values;
    return laporanAPI.updateLaporan(
      dataLaporan.id,
      kegiatan,
      tahapan,
      keterangan,
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
      keluhan: fields.keluhan,
      name: fields.name,
      date: dataLaporan.tanggal_laporan,
      kegiatan: convertedKegiatan,
      tahapan: convertedTahapan,
      keterangan: fields.keterangan,
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

  useEffect(() => {
    if (id) {
      laporanAPI.getLaporan(id).then(res => setDataLaporan(res));
    }
  }, [id]);

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

  const getProsesPemetaan = () => {
    if (!isEmpty(dataLaporan)) {
      const tahapan = JSON.parse(dataLaporan.tahapan);
      const tahapanProsesPemetaan = find(tahapan, o => o.prosesPemetaan);
      if (tahapanProsesPemetaan) {
        return tahapanProsesPemetaan.prosesPemetaan;
      }
      return false;
    }
    return 0;
  };

  const getSelesaiPemetaan = () => {
    if (!isEmpty(dataLaporan)) {
      const tahapan = JSON.parse(dataLaporan.tahapan);
      const tahapanSelesaiPemetaan = find(tahapan, o => o.selesaiPemetaan);
      if (tahapanSelesaiPemetaan) {
        return tahapanSelesaiPemetaan.selesaiPemetaan;
      }
      return false;
    }
    return 0;
  };

  const getProsesPenyuluhan = () => {
    if (!isEmpty(dataLaporan)) {
      const tahapan = JSON.parse(dataLaporan.tahapan);
      const tahapanProsesPenyuluhan = find(tahapan, o => o.prosesPenyuluhan);
      if (tahapanProsesPenyuluhan) {
        return tahapanProsesPenyuluhan.prosesPenyuluhan;
      }
      return false;
    }
    return 0;
  };

  const getSelesaiPenyuluhan = () => {
    if (!isEmpty(dataLaporan)) {
      const tahapan = JSON.parse(dataLaporan.tahapan);
      const tahapanSelesaiPenyuluhan = find(tahapan, o => o.selesaiPenyuluhan);
      if (tahapanSelesaiPenyuluhan) {
        return tahapanSelesaiPenyuluhan.selesaiPenyuluhan;
      }
      return false;
    }
    return 0;
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
          <Form
            name="edit-laporan"
            layout="vertical"
            initialValues={{
              name: dataLaporan.fieldstaff_name,
              date: getDate(),
              inputDate: getDateInput(),
              keterangan: dataLaporan.keterangan,
              keluhan: dataLaporan.keluhan,
              koordinasi: getKoordinasi(),
              pendampingan: getPendampingan(),
              meeting: getMeeting(),
              kunjungan: getKunjungan(),
              lainnya: getLainnya(),
              prosespemetaan: getProsesPemetaan(),
              selesaipemetaan: getSelesaiPemetaan(),
              prosespenyuluhan: getProsesPenyuluhan(),
              selesaipenyuluhan: getSelesaiPenyuluhan(),
              saran: dataLaporan.saran
            }}
            onFinish={handleFinish}
          >
            <Form.Item name="name" label="NAMA FS" labelAlign="left">
              <Input disabled />
            </Form.Item>

            <Form.Item name="date" label="TANGGAL LAPORAN" labelAlign="left">
              <Input disabled />
            </Form.Item>

            <Form.Item name="inputDate" label="TANGGAL INPUT" labelAlign="left">
              <Input disabled />
            </Form.Item>

            <div className={styles["form__checkbox--group"]}>
              <Form.Item label="KEGIATAN">
                <Form.Item name="koordinasi" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Koordinasi dengan kantah
                  </Checkbox>
                </Form.Item>
                <Form.Item name="pendampingan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Melakukan Pendampingan
                  </Checkbox>
                </Form.Item>
                <Form.Item name="meeting" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Rapat/Meeting
                  </Checkbox>
                </Form.Item>
                <Form.Item name="kunjungan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Melakukan Kunjungan
                  </Checkbox>
                </Form.Item>
                <Form.Item name="lainnya" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Lainnya
                  </Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item label="TAHAPAN AKSES REFORMA">
                <Form.Item name="prosespemetaan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Proses Pemetaan
                  </Checkbox>
                </Form.Item>
                <Form.Item name="selesaipemetaan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Selesai Pemetaan
                  </Checkbox>
                </Form.Item>
                <Form.Item name="prosespenyuluhan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Proses Penyuluhan
                  </Checkbox>
                </Form.Item>
                <Form.Item name="selesaipenyuluhan" valuePropName="checked">
                  <Checkbox disabled={userLevel === users.Kantah}>
                    Selesai Penyuluhan
                  </Checkbox>
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
              <Input.TextArea disabled={userLevel === users.Kantah} />
            </Form.Item>

            <Form.Item
              name="keluhan"
              fieldKey="keluhan"
              label="KELUHAN"
              labelAlign="left"
            >
              <Input.TextArea disabled={userLevel === users.Kantah} />
            </Form.Item>

            <Form.Item
              name="saran"
              fieldKey="saran"
              label="SARAN"
              labelAlign="left"
            >
              <Input.TextArea disabled={userLevel !== users.Kantah} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                UPDATE
              </Button>
            </Form.Item>
          </Form>
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
