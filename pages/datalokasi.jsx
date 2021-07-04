import React from "react";
import ViewLokasi from "../src/component/organism/Lokasi/ViewLokasi/ViewLokasi";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataLokasiPage = () => {
  return (
    <>
      <h2>Data Lokasi</h2>
      <ViewLokasi />
    </>
  );
};

DataLokasiPage.layout = DashboardTemplate;

export default DataLokasiPage;
