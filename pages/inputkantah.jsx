import React from "react";
import InputKantah from "../src/component/organism/Kantah/InputKantah";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputKantahPage = () => {
  return (
    <>
      <h2>Tambah Data Kantah</h2>
      <InputKantah />
    </>
  );
};

InputKantahPage.layout = DashboardTemplate;

export default InputKantahPage;
