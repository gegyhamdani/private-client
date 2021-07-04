import React from "react";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";
import Dashboard from "../src/component/organism/Dashboard/Dashboard";

const DashboardPage = () => {
  return <Dashboard />;
};

DashboardPage.layout = DashboardTemplate;

export default DashboardPage;
