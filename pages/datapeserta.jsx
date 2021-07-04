import React from "react";
import ViewPeserta from "../src/component/organism/Peserta/ViewPeserta/ViewPeserta";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataPeserta = () => {
  return (
    <>
      <h2>Data Peserta Pemberdayaan</h2>
      <ViewPeserta />
    </>
  );
};

DataPeserta.layout = DashboardTemplate;

export default DataPeserta;
