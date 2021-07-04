import React from "react";
import InputPeserta from "../src/component/organism/Peserta/InputPeserta";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputPesertaPage = () => {
  return (
    <>
      <h2>Tambah Data Peserta Pemberdayaan</h2>
      <InputPeserta />
    </>
  );
};

InputPesertaPage.layout = DashboardTemplate;

export default InputPesertaPage;
