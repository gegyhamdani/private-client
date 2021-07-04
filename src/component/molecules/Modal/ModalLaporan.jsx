import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import { Modal, Button, Form, Input, notification } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";

import laporanAPI from "../../../api/laporanAPI";
import users from "../../../constant/user";

const { TextArea } = Input;

const ModalLaporan = ({ id, isModalVisible, onCloseModal }) => {
  const [dataLaporan, setDataLaporan] = useState({});
  const userLevel = useSelector(state => state.auth.level);

  const handleOk = () => {
    setDataLaporan({});
    onCloseModal();
  };

  const handleCancel = () => {
    setDataLaporan({});
    onCloseModal();
  };

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Data fieldstaff berhasil diupdate",
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

  const updateLaporan = values => {
    const { kegiatan, keterangan, foto, location, keluhan, saran } = values;
    return laporanAPI.updateLaporan(
      dataLaporan.id,
      kegiatan,
      keterangan,
      foto,
      location,
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

    const kegiatan = [koordinasi, kunjungan, meeting, pendampingan, lainnya];
    const convertedKegiatan = JSON.stringify(kegiatan);

    const values = {
      keluhan: fields.keluhan,
      name: fields.name,
      date: dataLaporan.tanggal_laporan,
      kegiatan: convertedKegiatan,
      location: fields.location,
      keterangan: fields.keterangan,
      foto: fields.upload,
      saran: fields.saran
    };

    updateLaporan(values)
      .then(() => {
        openNotificationSuccess(() => {
          handleCancel();
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
      const date = new Date(dataLaporan.tanggal_laporan);
      const dateDay =
        date.getDate().toString().length < 2
          ? `0${date.getDate()}`
          : date.getDate();
      const dateMonth = date.getMonth().toString().length
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
      return `${dateDay} - ${dateMonth} - ${date.getFullYear()}`;
    }
    return 0;
  };

  const getKoordinasi = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      return find(kegiatan, o => o.koordinasi);
    }
    return 0;
  };

  const getPendampingan = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      return find(kegiatan, o => o.pendampingan);
    }
    return 0;
  };

  const getMeeting = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      return find(kegiatan, o => o.meeting);
    }
    return 0;
  };

  const getKunjungan = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      return find(kegiatan, o => o.kunjungan);
    }
    return 0;
  };

  const getLainnya = () => {
    if (!isEmpty(dataLaporan)) {
      const kegiatan = JSON.parse(dataLaporan.kegiatan);
      return find(kegiatan, o => o.lainnya);
    }
    return 0;
  };

  return (
    <>
      <Modal
        title="Detail Laporan"
        visible={isModalVisible}
        onOk={handleOk}
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
              location: dataLaporan.lokasi,
              keterangan: dataLaporan.keterangan,
              keluhan: dataLaporan.keluhan,
              koordinasi: getKoordinasi(),
              pendampingan: getPendampingan(),
              meeting: getMeeting(),
              kunjungan: getKunjungan(),
              lainnya: getLainnya(),
              saran: dataLaporan.saran
            }}
            onFinish={handleFinish}
          >
            <Form.Item name="name" label="NAMA FS" labelAlign="left">
              <Input disabled />
            </Form.Item>

            <Form.Item name="date" label="TANGGAL" labelAlign="left">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="location"
              label="LOKASI PEMBERDAYAAN"
              labelAlign="left"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item label="KEGIATAN">
              <Form.Item name="koordinasi" valuePropName="checked">
                <Checkbox disabled>Koordinasi dengan kantah</Checkbox>
              </Form.Item>
              <Form.Item name="pendampingan" valuePropName="checked">
                <Checkbox disabled>Melakukan Pendampingan</Checkbox>
              </Form.Item>
              <Form.Item name="meeting" valuePropName="checked">
                <Checkbox disabled>Rapat/Meeting</Checkbox>
              </Form.Item>
              <Form.Item name="kunjungan" valuePropName="checked">
                <Checkbox disabled>Melakukan Kunjungan</Checkbox>
              </Form.Item>
              <Form.Item name="lainnya" valuePropName="checked">
                <Checkbox disabled>Lainnya</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item name="keterangan" label="KETERANGAN" labelAlign="left">
              <TextArea disabled />
            </Form.Item>

            <Form.Item
              name="keluhan"
              fieldKey="keluhan"
              label="KELUHAN"
              labelAlign="left"
            >
              <TextArea disabled />
            </Form.Item>

            <Form.Item
              name="saran"
              fieldKey="saran"
              label="SARAN"
              labelAlign="left"
            >
              <TextArea disabled={userLevel !== users.Kantah} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={userLevel !== users.Kantah}
              >
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
