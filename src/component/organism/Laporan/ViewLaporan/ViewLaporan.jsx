/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Space, Tag, Button, notification } from "antd";
import {
  LoadingOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
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

const ViewLaporan = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [laporanId, setLaporanId] = useState(0);
  const [isUpdate, setUpdate] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
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
    setLaporanId(id);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setLaporanId(0);
  };

  const handleSearch = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData.flat());
    const getSearch = initData.flat().filter(obj => {
      return obj.fieldstaff_name.toLowerCase().includes(val.toLowerCase());
    });
    return setData(getSearch);
  };

  const handleDelete = val => {
    setIsModalDeleteVisible(true);
    setLaporanId(val);
  };

  const handleOkModalDelete = () => {
    setConfirmLoadingDelete(true);
    laporanAPI
      .deleteLaporan(laporanId)
      .then(() => {
        openNotificationSuccess("Data berhasil di hapus");
        setUpdate(true);
        setConfirmLoadingDelete(false);
      })
      .finally(() => setIsModalDeleteVisible(false));
  };

  const handleCancelModalDelete = () => {
    setIsModalDeleteVisible(false);
    setLaporanId(0);
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const getLaporanData = id => {
    return new Promise(resolve => {
      laporanAPI
        .getUserLaporan(id)
        .then(res => {
          const shortByDate = res.sort(
            (a, b) => new Date(b.tanggal_laporan) - new Date(a.tanggal_laporan)
          );
          const convertData = shortByDate.map(val => {
            const arrKegiatan = JSON.parse(val.kegiatan);
            const kegiatan = arrKegiatan
              .map(item => {
                return getKeyByValue(item, true);
              })
              .filter(item => item);

            return {
              ...val,
              tanggal_laporan: dateHelper.convertDate(val.tanggal_laporan),
              tanggal_input: dateHelper.convertDate(val.tanggal_input),
              kegiatan: kegiatan.join(", ")
            };
          });
          return resolve(convertData);
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
      const fieldstaffKantah = await laporanAPI.getUserLaporan(item.id);
      return fieldstaffKantah;
    });
    const datas = await Promise.all(dataPromises);
    const flattenData = datas.flat(1);

    if (flattenData.length === 0) {
      setLoading(false);
    } else {
      const shortByDate = flattenData.sort(
        (a, b) => new Date(b.tanggal_laporan) - new Date(a.tanggal_laporan)
      );
      const convertData = shortByDate.map(val => {
        const arrKegiatan = JSON.parse(val.kegiatan);
        const kegiatan = arrKegiatan
          .map(item => {
            return getKeyByValue(item, true);
          })
          .filter(item => item);

        return {
          ...val,
          tanggal_laporan: dateHelper.convertDate(val.tanggal_laporan),
          tanggal_input: dateHelper.convertDate(val.tanggal_input),
          kegiatan: kegiatan.join(", ")
        };
      });

      setInitData(convertData);
      setEmptyData(convertData.length === 0);
    }
  };

  const getKantahFieldstaffLaporan = async () => {
    const fieldstaff = await fieldstaffAPI.getFieldstaffKantah(userId);
    if (fieldstaff.length === 0) {
      setLoading(false);
    } else {
      const dataPromises = fieldstaff.map(async item => {
        const fieldstaffKantah = await laporanAPI.getUserLaporan(item.id);
        return fieldstaffKantah;
      });
      const datas = await Promise.all(dataPromises);
      const flattenData = datas.flat(1);

      if (flattenData.length === 0) {
        setLoading(false);
      } else {
        const shortByDate = flattenData.sort(
          (a, b) => new Date(b.tanggal_laporan) - new Date(a.tanggal_laporan)
        );
        const convertData = shortByDate.map(val => {
          const arrKegiatan = JSON.parse(val.kegiatan);
          const kegiatan = arrKegiatan
            .map(item => {
              return getKeyByValue(item, true);
            })
            .filter(item => item);

          return {
            ...val,
            tanggal_laporan: dateHelper.convertDate(val.tanggal_laporan),
            tanggal_input: dateHelper.convertDate(val.tanggal_input),
            kegiatan: kegiatan.join(", ")
          };
        });

        setInitData(convertData);
        setEmptyData(convertData.length === 0);
      }
    }
  };

  const getFieldstaffLaporan = () => {
    getLaporanData(userId).then(res => {
      if (res.length === 0) setLoading(false);
      setInitData(res);
      setEmptyData(res.length === 0);
    });
  };

  const getLaporan = () => {
    setLoading(true);
    if (userLevel === users.Kantah) return getKantahFieldstaffLaporan();
    if (userLevel === users.Kanwil) return getKanwilKantahFieldstaffLaporan();
    return getFieldstaffLaporan();
  };

  useEffect(() => {
    getLaporan();
  }, [userLevel, userId]);

  useEffect(() => {
    if (isUpdate) {
      getLaporan();
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
      <ModalLaporan
        isModalVisible={isModalVisible}
        onCloseModal={handleCloseModal}
        id={laporanId}
      />
      <Modal
        title="Delete laporan"
        visible={isModalDeleteVisible}
        onOk={handleOkModalDelete}
        onCancel={handleCancelModalDelete}
        confirmLoading={confirmLoadingDelete}
      >
        <p>Apakah anda yakin akan menghapus data laporan?</p>
      </Modal>
      <div className={styles.container}>
        <div className={styles.field}>
          <Search
            placeholder="Cari nama fieldstaff"
            allowClear
            onSearch={handleSearch}
            style={{ width: 350 }}
          />
          {userLevel === users.Fieldstaff && (
            <Button
              type="primary"
              style={{ width: 200 }}
              icon={<PlusCircleOutlined style={{ fontSize: "18px" }} />}
              className={styles.button}
              onClick={() => {
                router.push("/inputlaporan");
              }}
            >
              Tambah Data Laporan
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
            <Column
              title="Tanggal Laporan"
              dataIndex="tanggal_laporan"
              key="tanggal_laporan"
            />
            <Column
              title="Tanggal Input"
              dataIndex="tanggal_input"
              key="tanggal_input"
            />
            <Column title="Kegiatan" dataIndex="kegiatan" key="kegiatan" />
            <Column
              title="Keluhan"
              dataIndex="keluhan"
              key="keluhan"
              render={(keluhan, laporan) => {
                return (
                  keluhan && (
                    <Tag color={laporan.saran ? "green" : "red"} key={keluhan}>
                      {laporan.saran
                        ? "Saran sudah diberikan"
                        : "Terdapat Keluhan"}
                    </Tag>
                  )
                );
              }}
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
              style={{ width: 200 }}
              icon={<DownloadOutlined style={{ fontSize: "18px" }} />}
              onClick={() => {
                router.push("/cetaklaporan");
              }}
              className={styles.button}
            >
              Cetak Laporan
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewLaporan;
