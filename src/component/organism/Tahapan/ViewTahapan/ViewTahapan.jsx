/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Table, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";

const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ViewTahapan = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <div className={styles.container}>
        {isLoading ? (
          <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
        ) : (
          <Table dataSource={data} rowKey="id">
            <Column title="Nama Fieldstaff" dataIndex="" key="" />
            <Column title="Total" dataIndex="" key="" />
            <Column title="Pemetaan Sosial" dataIndex="" key="" />
            <Column title="Penyuluhan" dataIndex="" key="" />
            <Column title="Penyusunan Model" dataIndex="" key="" />
            <Column title="Pendampingan" dataIndex="" key="" />
            <Column title="Evaluasi dan Pelaporan" dataIndex="" key="" />
          </Table>
        )}
      </div>
    </>
  );
};

export default ViewTahapan;
