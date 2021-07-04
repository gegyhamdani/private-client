import React from "react";
import ViewKantah from "../src/component/organism/Kantah/ViewKantah/ViewKantah";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataKantahPage = () => {
  return (
    <>
      <h2>Data Kantah</h2>
      <ViewKantah />
    </>
  );
};

DataKantahPage.layout = DashboardTemplate;

export default DataKantahPage;
