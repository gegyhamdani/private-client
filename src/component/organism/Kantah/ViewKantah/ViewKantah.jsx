import React, { useState, useEffect } from "react";
import { Table, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import kantahAPI from "../../../../api/kantahAPI";
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
    title: "Total Fieldstaff",
    dataIndex: "t_fs",
    key: "t_fs",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.t_fs - b.t_fs
  }
];

const ViewKantah = () => {
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
    kantahAPI
      .getKantah()
      .then(res => {
        const sort = res.sort((a, b) => b.id - a.id);
        const datas = [];
        const promises = [];
        sort.map(val => {
          return promises.push(
            fieldstaffAPI.getFieldstaffKantah(val.id).then(fsVal => {
              datas.push({ ...val, t_fs: fsVal.length });
            })
          );
        });
        return new Promise(resolve =>
          Promise.all(promises).then(() => resolve(datas))
        );
      })
      .then(val => setInitData(val))
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
        placeholder="Cari nama kantah"
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

export default ViewKantah;
