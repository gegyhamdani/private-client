import React from "react";
import ViewFieldstaff from "../src/component/organism/Fieldstaff/ViewFieldstaff/ViewFieldstaff";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const DataFieldstaffPage = () => {
  return (
    <>
      <h2>Data Fieldstaff</h2>
      <ViewFieldstaff />
    </>
  );
};

DataFieldstaffPage.layout = DashboardTemplate;

export default DataFieldstaffPage;
