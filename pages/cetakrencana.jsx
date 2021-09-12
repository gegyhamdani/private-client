import React from "react";
import PublishRencana from "../src/component/organism/Rencana/PublishRencana";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const CetakRencanaPage = () => {
  return (
    <>
      <h2>Cetak Rencana Bulanan</h2>
      <PublishRencana />
    </>
  );
};

CetakRencanaPage.layout = DashboardTemplate;

export default CetakRencanaPage;
