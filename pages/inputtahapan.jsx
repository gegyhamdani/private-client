import React from "react";
import InputTahapan from "../src/component/organism/Tahapan/InputTahapan";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputTahapanPage = () => {
  return (
    <>
      <h2>Input Tahapan</h2>
      <InputTahapan />
    </>
  );
};

InputTahapanPage.layout = DashboardTemplate;

export default InputTahapanPage;
