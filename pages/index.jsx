import React from "react";
import Login from "../src/component/organism/Login";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default Home;
