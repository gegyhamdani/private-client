import React from "react";
import InputFieldStaff from "../src/component/organism/Fieldstaff/InputFieldstaff/InputFieldstaff";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const InputFieldstaffPage = () => {
  return (
    <>
      <h2>Tambah Data Fieldstaff</h2>
      <InputFieldStaff />
    </>
  );
};

InputFieldstaffPage.layout = DashboardTemplate;

export default InputFieldstaffPage;
