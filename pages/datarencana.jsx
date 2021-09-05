import React from "react";
import ViewRencana from "../src/component/organism/Rencana/ViewRencana";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataRencanaPage = () => {
  return (
    <>
      <h2>Data Rencana Bulanan</h2>
      <ViewRencana />
    </>
  );
};

DataRencanaPage.layout = DashboardTemplate;

export default DataRencanaPage;
