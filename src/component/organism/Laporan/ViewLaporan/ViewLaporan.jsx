/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Space, Tag, Button } from "antd";
import {
  LoadingOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import users from "../../../../constant/user";
import ModalLaporan from "../../../molecules/Modal";

const { Search } = Input;
const { Column } = Table;

const ViewLaporan = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [uId, setUId] = useState("");
  const [userFieldstaff, setUserFieldstaff] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [laporanId, setLaporanId] = useState(0);
  const router = useRouter();

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);

  const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

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

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const getLaporanData = id => {
    return new Promise(resolve => {
      laporanAPI
        .getUserLaporan(id)
        .then(res => {
          const value = res.map(val => {
            const arrKegiatan = JSON.parse(val.kegiatan);
            const kegiatan = arrKegiatan
              .map(item => {
                return getKeyByValue(item, true);
              })
              .filter(item => item);
            const date = new Date(val.tanggal_laporan);
            const dateDay =
              date.getDate().toString().length < 2
                ? `0${date.getDate()}`
                : date.getDate();
            const dateMonth = date.getMonth().toString().length
              ? `0${date.getMonth() + 1}`
              : date.getMonth() + 1;
            return {
              ...val,
              tanggal_laporan: `${dateDay} - ${dateMonth} - ${date.getFullYear()}`,
              kegiatan: kegiatan.join(", ")
            };
          });
          return resolve(value.sort((a, b) => b.id - a.id));
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (uId) {
      getLaporanData(uId).then(res => {
        if (res.length === 0) setLoading(false);
        setInitData(res);
      });
    }
  }, [uId]);

  useEffect(() => {
    if (userFieldstaff.length > 0) {
      userFieldstaff.map(val => {
        return getLaporanData(val.id).then(res => {
          if (res.length === 0) setLoading(false);
          setInitData(state => [...state, res]);
        });
      });
    }
  }, [userFieldstaff]);

  useEffect(() => {
    setLoading(true);
    if (userLevel === users.Kantah) {
      return fieldstaffAPI.getFieldstaffKantah(userId).then(res => {
        return setUserFieldstaff(res);
      });
    }
    return setUId(userId);
  }, [userLevel, userId]);

  useEffect(() => {
    if (initData.length > 0) {
      const flattenData = initData.flat();
      setData(flattenData);
      setLoading(false);
    }
  }, [initData]);

  return (
    <>
      <ModalLaporan
        isModalVisible={isModalVisible}
        onCloseModal={handleCloseModal}
        id={laporanId}
      />
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
              render={(text, record) => {
                return (
                  <Space size="middle">
                    <Button
                      onClick={() => handleOpenModal(record.id)}
                      icon={<SearchOutlined />}
                    >
                      Lihat
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
