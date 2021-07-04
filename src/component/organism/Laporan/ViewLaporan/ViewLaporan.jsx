import { Table } from "antd";
import React from "react";

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

const ViewLaporan = () => {
  return <Table columns={columns} />;
};

export default ViewLaporan;
