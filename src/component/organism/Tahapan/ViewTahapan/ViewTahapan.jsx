import React from "react";
import { useSelector } from "react-redux";

import TahapanFieldstaff from "./TahapanFieldstaff";
import TahapanKantah from "./TahapanKantah";

import users from "../../../../constant/user";
import styles from "./index.module.css";

const ViewTahapan = () => {
  const userLevel = useSelector(state => state.auth.level);

  return (
    <div className={styles.container}>
      {userLevel === users.Kantah && <TahapanKantah />}
      {userLevel === users.Fieldstaff && <TahapanFieldstaff />}
    </div>
  );
};

export default ViewTahapan;
