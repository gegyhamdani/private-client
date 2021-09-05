import React from "react";
import InputRencana from "../src/component/organism/Rencana/InputRencana";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputLaporanPage = () => {
  return (
    <>
      <h2>Input Rencana Bulanan</h2>
      <InputRencana />
    </>
  );
};

InputLaporanPage.layout = DashboardTemplate;

export default InputLaporanPage;
