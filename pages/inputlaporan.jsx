import React from "react";
import InputLaporan from "../src/component/organism/Laporan/InputLaporan";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputLaporanPage = () => {
  return (
    <>
      <h2>Input Laporan Harian</h2>
      <InputLaporan />
    </>
  );
};

InputLaporanPage.layout = DashboardTemplate;

export default InputLaporanPage;
