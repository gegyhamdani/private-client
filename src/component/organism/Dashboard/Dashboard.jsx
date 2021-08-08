/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector } from "react-redux";

import DashboardKanwil from "./DashboardKanwil";
import DashboardKantah from "./DashboardKantah";
import DashboardFieldstaff from "./DashboardFieldstaff";

import users from "../../../constant/user";

import styles from "./index.module.css";

const Dashboard = () => {
  const level = useSelector(state => state.auth.level);
  return (
    <>
      <h1 className={styles.title}>Dashboard</h1>
      {level === users.Kanwil && <DashboardKanwil />}
      {level === users.Kantah && <DashboardKantah />}
      {level === users.Fieldstaff && <DashboardFieldstaff />}
    </>
  );
};

export default Dashboard;
