import React, { useState, useEffect } from "react";
import { Table, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import locationAPI from "../../../../api/locationAPI";

const { Search } = Input;

const columns = [
  {
    title: "Desa",
    dataIndex: "desa",
    key: "desa"
  },
  {
    title: "Kecamatan",
    dataIndex: "kecamatan",
    key: "kecamatan"
  },
  {
    title: "Kabupaten/Kota",
    dataIndex: "kota",
    key: "kota"
  },
  {
    title: "Provinsi",
    dataIndex: "provinsi",
    key: "provinsi"
  }
];

const ViewLokasi = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
    setLoading(true);
    locationAPI
      .getLocation()
      .then(res => {
        const sort = res.sort((a, b) => b.id - a.id);
        setInitData(sort);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initData.length > 0) {
      setData(initData);
      setLoading(false);
    }
  }, [initData]);

  return (
    <div className={styles.container}>
      <Search
        placeholder="Cari kecamatan"
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

export default ViewLokasi;
