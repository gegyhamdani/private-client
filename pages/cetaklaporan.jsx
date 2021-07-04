import React from "react";
import PublishLaporan from "../src/component/organism/Laporan/PublishLaporan";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const CetakLaporanPage = () => {
  return (
    <>
      <h2>Cetak Laporan</h2>
      <PublishLaporan />
    </>
  );
};

CetakLaporanPage.layout = DashboardTemplate;

export default CetakLaporanPage;
