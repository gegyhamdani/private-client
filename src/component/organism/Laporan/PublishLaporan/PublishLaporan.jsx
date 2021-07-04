import React from "react";
import { Button, DatePicker, Table } from "antd";

import styles from "./index.module.css";

const columns = [
  {
    title: "Tanggal",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "Uraian Pekerjaan",
    dataIndex: "work",
    key: "work"
  },
  {
    title: "Foto",
    dataIndex: "image",
    key: "image"
  }
];

const { RangePicker } = DatePicker;

const PublishLaporan = () => {
  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };

  const onOk = value => {
    console.log("onOk: ", value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <p>Tanggal</p>
        <RangePicker format="YYYY-MM-DD" onChange={onChange} onOk={onOk} />
      </div>
      <div className={`${styles.row} ${styles.row__margin}`}>
        <Button type="primary">Tampilkan Data</Button>
        <Button type="primary">Cetak Laporan</Button>
      </div>
      <div className={styles.table}>
        <Table columns={columns} />
      </div>
    </div>
  );
};

export default PublishLaporan;
