import React from "react";
import ViewLaporan from "../src/component/organism/Laporan/ViewLaporan";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataLaporanPage = () => {
  return (
    <>
      <h2>Data Laporan</h2>
      <ViewLaporan />
    </>
  );
};

DataLaporanPage.layout = DashboardTemplate;

export default DataLaporanPage;
