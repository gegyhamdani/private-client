import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";

const { Search } = Input;

const columns = [
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: "Tanggal Lahir",
    dataIndex: "date_born",
    key: "date_born"
  },
  {
    title: "Alamat",
    dataIndex: "alamat",
    key: "alamat",
    sorter: (a, b) => a.alamat.localeCompare(b.alamat)
  }
];

const ViewFieldstaff = () => {
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
    setLoading(true);
    fieldstaffAPI
      .getFieldstaffKantah(userId)
      .then(res => {
        const value = res.map(val => {
          const date = new Date(val.date_born);
          const dateDay =
            date.getDate().toString().length < 2
              ? `0${date.getDate()}`
              : date.getDate();
          const dateMonth = date.getMonth().toString().length
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
          return {
            ...val,
            date_born: `${dateDay} - ${dateMonth} - ${date.getFullYear()}`
          };
        });
        const sort = value.sort((a, b) => b.id - a.id);
        setInitData(sort);
      })
      .catch(() => {
        setLoading(false);
      });
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

export default ViewFieldstaff;
