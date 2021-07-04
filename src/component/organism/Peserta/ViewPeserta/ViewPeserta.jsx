import { Table } from "antd";
import React from "react";

const columns = [
  {
    title: "NIK",
    dataIndex: "nik",
    key: "nik"
  },
  {
    title: "Nama",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Tanggal Lahir",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "Lokasi Pembedayaan",
    dataIndex: "location",
    key: "location"
  },
  {
    title: "Model Pembedayaan",
    dataIndex: "model",
    key: "model"
  }
];

const ViewPeserta = () => {
  return <Table columns={columns} />;
};

export default ViewPeserta;
