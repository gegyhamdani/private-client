/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Space, Tag, Button, notification } from "antd";
import {
  LoadingOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

import Modal from "antd/lib/modal/Modal";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import users from "../../../../constant/user";
import ModalLaporan from "../../../molecules/Modal";
import dateHelper from "../../../../helpers/dateHelper";
import kantahAPI from "../../../../api/kantahAPI";

const { Search } = Input;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ViewRencana = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [laporanId, setLaporanId] = useState(0);
  const [isUpdate, setUpdate] = useState(false);

  const router = useRouter();

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);

  const openNotificationSuccess = message => {
    notification.success({
      message,
      duration: 2
    });
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    setIsModalDeleteVisible(true);
  };

  const handleOkModalDelete = () => {
    setConfirmLoadingDelete(true);
    setIsModalDeleteVisible(false);
  };

  const handleCancelModalDelete = () => {
    setIsModalDeleteVisible(false);
    setLaporanId(0);
  };

  return (
    <>
      <ModalLaporan
        isModalVisible={isModalVisible}
        onCloseModal={handleCloseModal}
        id={laporanId}
      />
      <Modal
        title="Delete rencana"
        visible={isModalDeleteVisible}
        onOk={handleOkModalDelete}
        onCancel={handleCancelModalDelete}
        confirmLoading={confirmLoadingDelete}
      >
        <p>Apakah anda yakin akan menghapus data rencana bulanan?</p>
      </Modal>
      <div className={styles.container}>
        <div className={styles.field}>
          {userLevel === users.Fieldstaff && (
            <Button
              type="primary"
              style={{ width: 220 }}
              icon={<PlusCircleOutlined style={{ fontSize: "18px" }} />}
              className={styles.button}
              onClick={() => {
                router.push("/inputrencana");
              }}
            >
              Tambah Rencana Bulanan
            </Button>
          )}
        </div>

        {isLoading ? (
          <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
        ) : (
          <Table dataSource={data} rowKey="id">
            <Column
              title="Nama Fieldstaff"
              dataIndex="fieldstaff_name"
              key="fieldstaff_name"
            />
            <Column title="Lokasi" dataIndex="lokasi" key="lokasi" />
            <Column
              title="Rencana Tindak Lanjut"
              dataIndex="tindak_lanjut"
              key="tindak_lanjut"
            />
            <Column title="Periode" dataIndex="periode" key="periode" />
            <Column
              title="Action"
              key="action"
              width="150px"
              render={(text, record) => {
                return (
                  <Space size="middle">
                    <Button
                      onClick={() => handleOpenModal(record.id)}
                      icon={<SearchOutlined />}
                    >
                      Lihat
                    </Button>
                    <Button
                      danger
                      onClick={() => handleDelete(record.id)}
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Space>
                );
              }}
            />
          </Table>
        )}
      </div>
    </>
  );
};

export default ViewRencana;
