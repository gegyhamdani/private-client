import React from "react";
import InputLokasi from "../src/component/organism/Lokasi/InputLokasi";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputLokasiPage = () => {
  return (
    <>
      <h2>Tambah Data Lokasi</h2>
      <InputLokasi />
    </>
  );
};

InputLokasiPage.layout = DashboardTemplate;

export default InputLokasiPage;
