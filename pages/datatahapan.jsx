import React from "react";
import ViewTahapan from "../src/component/organism/Tahapan/ViewTahapan";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataRencanaPage = () => {
  return (
    <>
      <h2>Data Tahapan</h2>
      <ViewTahapan />
    </>
  );
};

DataRencanaPage.layout = DashboardTemplate;

export default DataRencanaPage;
