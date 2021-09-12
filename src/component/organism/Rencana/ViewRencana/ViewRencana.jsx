/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Spin, Space, Button, notification } from "antd";
import {
  LoadingOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

import Modal from "antd/lib/modal/Modal";
import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import users from "../../../../constant/user";
import dateHelper from "../../../../helpers/dateHelper";
import kantahAPI from "../../../../api/kantahAPI";
import rencanaAPI from "../../../../api/rencanaAPI";
import ModalRencana from "../../../molecules/ModalRencana.jsx";

const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ViewRencana = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [rencanaId, setRencanaId] = useState(0);
  const [emptyData, setEmptyData] = useState(false);
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

  const handleOpenModal = id => {
    setIsModalVisible(true);
    setRencanaId(id);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = id => {
    setIsModalDeleteVisible(true);
    setRencanaId(id);
  };

  const handleOkModalDelete = () => {
    setConfirmLoadingDelete(true);
    rencanaAPI
      .deleteRencana(rencanaId)
      .then(() => {
        openNotificationSuccess("Data berhasil di hapus");
        setUpdate(true);
        setConfirmLoadingDelete(false);
      })
      .finally(() => setIsModalDeleteVisible(false));
  };

  const handleCancelModalDelete = () => {
    setIsModalDeleteVisible(false);
    setRencanaId(0);
  };

  const getRencanaData = id => {
    return new Promise(resolve => {
      rencanaAPI
        .getUserRencana(id)
        .then(res => {
          const value = res.map(val => {
            return {
              ...val,
              periode: dateHelper.convertMonthDate(val.periode)
            };
          });

          return resolve(value.sort((a, b) => b.id - a.id));
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const getKanwilKantahFieldstaffLaporan = async () => {
    const fieldstaffKanwil = await fieldstaffAPI.getFieldstaffKanwil(userId);
    const kantahData = await kantahAPI.getKantah();

    const kantahFieldstaffPromise = kantahData.map(async item => {
      const fieldstaff = await fieldstaffAPI.getFieldstaffKantah(item.id);
      return fieldstaff;
    });
    const kantahFieldstaffData = await Promise.all(kantahFieldstaffPromise);
    const fieldstaffData = kantahFieldstaffData.flat(1);
    const mergeData = [...fieldstaffData, ...fieldstaffKanwil];

    const dataPromises = mergeData.map(async item => {
      const fieldstaffKantah = await rencanaAPI.getUserRencana(item.id);
      return fieldstaffKantah;
    });
    const datas = await Promise.all(dataPromises);
    const flattenData = datas.flat(1);

    if (flattenData.length === 0) {
      setLoading(false);
    } else {
      const convertData = flattenData.map(val => {
        return {
          ...val,
          periode: dateHelper.convertMonthDate(val.periode)
        };
      });

      const sortData = convertData.sort((a, b) => b.id - a.id);

      setInitData(sortData);
      setEmptyData(sortData.length === 0);
    }
  };

  const getKantahFieldstaffLaporan = async () => {
    const fieldstaff = await fieldstaffAPI.getFieldstaffKantah(userId);
    if (fieldstaff.length === 0) {
      setLoading(false);
    } else {
      const dataPromises = fieldstaff.map(async item => {
        const fieldstaffKantah = await rencanaAPI.getUserRencana(item.id);
        return fieldstaffKantah;
      });
      const datas = await Promise.all(dataPromises);
      const flattenData = datas.flat(1);

      if (flattenData.length === 0) {
        setLoading(false);
      } else {
        const convertData = flattenData.map(val => {
          return {
            ...val,
            periode: dateHelper.convertMonthDate(val.periode)
          };
        });

        const sortData = convertData.sort((a, b) => b.id - a.id);

        setInitData(sortData);
        setEmptyData(sortData.length === 0);
      }
    }
  };

  const getFieldstaffRencana = () => {
    getRencanaData(userId).then(res => {
      if (res.length === 0) setLoading(false);
      setInitData(res);
      setEmptyData(res.length === 0);
    });
  };

  const getRencana = () => {
    setLoading(true);
    if (userLevel === users.Kantah) return getKantahFieldstaffLaporan();
    if (userLevel === users.Kanwil) return getKanwilKantahFieldstaffLaporan();
    return getFieldstaffRencana();
  };

  useEffect(() => {
    getRencana();
  }, [userLevel, userId]);

  useEffect(() => {
    if (isUpdate) {
      getRencana();
    }
  }, [isUpdate]);

  useEffect(() => {
    if (initData.length > 0) {
      const flattenData = initData.flat();
      setData(flattenData);
      setLoading(false);
      setUpdate(false);
    }
    if (emptyData) {
      setData([]);
      setLoading(false);
      setUpdate(false);
      setEmptyData(false);
    }
  }, [initData, emptyData]);

  return (
    <>
      <ModalRencana
        isModalVisible={isModalVisible}
        onCloseModal={handleCloseModal}
        id={rencanaId}
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
            <Column title="Periode" dataIndex="periode" key="periode" />
            <Column title="Lokasi" dataIndex="lokasi" key="lokasi" />
            <Column
              title="Rencana Tindak Lanjut"
              dataIndex="tindak_lanjut"
              key="tindak_lanjut"
            />
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
        <div className={styles.footer}>
          {userLevel === users.Fieldstaff && (
            <Button
              type="primary"
              style={{ width: 220 }}
              icon={<DownloadOutlined style={{ fontSize: "18px" }} />}
              onClick={() => {
                router.push("/cetakrencana");
              }}
              className={styles.button}
            >
              Cetak Rencana Bulanan
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewRencana;
