/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Button } from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import users from "../../../../constant/user";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import laporanAPI from "../../../../api/laporanAPI";

const DashboardKantah = () => {
  const [dataFieldstaff, setDataFieldstaff] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [keluhan, setKeluhan] = useState([]);
  const [saran, setSaran] = useState([]);
  const router = useRouter();

  const level = useSelector(state => state.auth.level);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    if (level === users.Kantah) {
      fieldstaffAPI.getFieldstaffKantah(userId).then(res => {
        setDataFieldstaff(res);
      });
    }
  }, [level]);

  useEffect(() => {
    if (dataFieldstaff.length > 0) {
      dataFieldstaff.map(val => {
        return laporanAPI.getUserLaporan(val.id).then(res => {
          setDataLaporan(state => [...state, res]);
        });
      });
    }
  }, [dataFieldstaff]);

  useEffect(() => {
    if (dataLaporan.length > 0) {
      const dataKeluhan = dataLaporan
        .flat()
        .map(val => {
          return val.keluhan ? val.keluhan : "";
        })
        .filter(e => {
          return e;
        });
      const dataSaran = dataLaporan
        .flat()
        .map(val => {
          return val.saran ? val.saran : "";
        })
        .filter(e => {
          return e;
        });
      setKeluhan(dataKeluhan);
      setSaran(dataSaran);
    }
  }, [dataLaporan]);

  return (
    <div className={styles.container}>
      <Card style={{ width: 200 }} className={styles.card}>
        <h2>{dataFieldstaff.length > 0 ? dataFieldstaff.length : 0}</h2>
        <h2>Fieldstaff</h2>
        <Button
          type="primary"
          block
          className={styles.card__fieldstaff}
          onClick={() => {
            router.push("/datafieldstaff");
          }}
        >
          Lihat Data
        </Button>
      </Card>
      <Card style={{ width: 200 }} className={styles.card}>
        <h2>{dataLaporan.length > 0 ? dataLaporan.flat().length : 0}</h2>
        <h2>Laporan</h2>
        <p>
          Terdapat
          {` ${keluhan.length > 0 ? keluhan.length - saran.length : 0} `}
          Keluhan
        </p>
        <Button
          type="primary"
          block
          onClick={() => {
            router.push("/datalaporan");
          }}
        >
          Lihat Data
        </Button>
      </Card>
    </div>
  );
};

export default DashboardKantah;
