import React from "react";
import Image from "next/image";
import Login from "../src/component/organism/Login";

import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon__login}>
        <Image
          src="/Logo-3.png"
          alt="Kementrian"
          width={226}
          height={211}
          quality="100"
        />
      </div>
      <Login />
    </div>
  );
};

export default Home;
