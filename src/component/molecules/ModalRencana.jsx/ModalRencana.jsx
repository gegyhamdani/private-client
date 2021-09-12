import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Modal, Button, Form, Input, notification } from "antd";
import { useRouter } from "next/router";

import dateHelper from "../../../helpers/dateHelper";
import rencanaAPI from "../../../api/rencanaAPI";

const ModalRencana = ({ id, isModalVisible, onCloseModal }) => {
  const [dataRencana, setDataRencana] = useState({});
  const router = useRouter();

  const handleCancel = () => {
    setDataRencana({});
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

  const updateRencana = values => {
    const { lokasi, tindak } = values;
    return rencanaAPI.updateRencana(dataRencana.id, lokasi, tindak);
  };

  const handleFinish = fields => {
    return updateRencana(fields)
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

  const getDate = () => {
    if (!isEmpty(dataRencana)) {
      return dateHelper.convertMonthDate(dataRencana.periode);
    }
    return 0;
  };
  useEffect(() => {
    if (id) {
      rencanaAPI.getRencana(id).then(res => setDataRencana(res));
    }
  }, [id]);

  return (
    <>
      <Modal
        title="Detail Rencana"
        visible={isModalVisible}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={null}
      >
        {!isEmpty(dataRencana) && (
          <>
            <Form
              name="edit-laporan"
              layout="vertical"
              initialValues={{
                name: dataRencana.fieldstaff_name,
                date: getDate(),
                lokasi: dataRencana.lokasi,
                tindak: dataRencana.tindak_lanjut
              }}
              onFinish={handleFinish}
            >
              <Form.Item name="name" label="NAMA FS" labelAlign="left">
                <Input disabled />
              </Form.Item>

              <Form.Item name="date" label="PERIODE" labelAlign="left">
                <Input disabled />
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

ModalRencana.propTypes = {
  id: PropTypes.number,
  isModalVisible: PropTypes.bool,
  onCloseModal: PropTypes.func
};

ModalRencana.defaultProps = {
  id: 0,
  isModalVisible: false,
  onCloseModal: () => {}
};

export default ModalRencana;
