import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";

const { Search } = Input;

const columns = [
  {
    title: "Nama Fieldstaff",
    dataIndex: "fieldstaff_name",
    key: "fieldstaff_name"
  },
  {
    title: "Tanggal Laporan",
    dataIndex: "tanggal_laporan",
    key: "tanggal_laporan"
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan"
  },
  {
    title: "Kegiatan",
    dataIndex: "kegiatan",
    key: "kegiatan"
  },
  {
    title: "Foto",
    dataIndex: "foto",
    key: "foto"
  }
];

const ViewLaporan = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const userId = useSelector(state => state.auth.userId);

  const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

  const handleSearch = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData);
    const test = data.filter(obj => {
      return obj.name.toLowerCase().includes(val.toLowerCase());
    });
    return setData(test);
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      laporanAPI
        .getUserLaporan(userId)
        .then(res => {
          const value = res.map(val => {
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
              tanggal_laporan: `${dateDay} - ${dateMonth} - ${date.getFullYear()}`
            };
          });
          const sort = value.sort((a, b) => b.id - a.id);
          setInitData(sort);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (initData.length > 0) {
      setData(initData);
      setLoading(false);
    }
  }, [initData]);

  return (
    <div className={styles.container}>
      <Search
        placeholder="Cari nama fieldstaff"
        allowClear
        onSearch={handleSearch}
        style={{ width: 350, marginTop: "1em", marginBottom: "1em" }}
      />
      {isLoading ? (
        <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="id" />
      )}
    </div>
  );
};

export default ViewLaporan;
