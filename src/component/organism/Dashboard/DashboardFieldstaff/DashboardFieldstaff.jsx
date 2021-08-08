import React, { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { PieChart } from "react-minimal-pie-chart";

import { useSelector } from "react-redux";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import dateHelper from "../../../../helpers/dateHelper";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const DashboardFieldstaff = () => {
  const [lastInputDate, setLastInputDate] = useState("");
  const [totalInput, setTotalInput] = useState(0);
  const [keluhan, setKeluhan] = useState(0);
  const [saran, setSaran] = useState(0);
  const [tahapan, setTahapan] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    setLoading(true);
    laporanAPI
      .getUserLaporan(userId)
      .then(res => {
        if (res.length > 0) {
          const totalData = res.length;

          const inputDateData = res[res.length - 1].tanggal_input;
          const convertedDateData = dateHelper.convertDate(inputDateData);
          setLastInputDate(convertedDateData);

          setTotalInput(totalData);

          const dataKeluhan = res
            .map(val => {
              return val.keluhan ? val.keluhan : "";
            })
            .filter(e => {
              return e;
            });
          setKeluhan(dataKeluhan.length);

          const dataSaran = res
            .map(val => {
              return val.saran ? val.saran : "";
            })
            .filter(e => {
              return e;
            });
          setSaran(dataSaran.length);

          const dataTahapan = res.map(val => JSON.parse(val.tahapan));
          const filterDataTahapan = dataTahapan.filter(val => {
            return val != null;
          });
          const percentDataTahapan =
            (filterDataTahapan.length / totalData) * 100;
          const numFormatter = new Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 1
          });
          const parseFormatter = parseFloat(
            numFormatter.format(percentDataTahapan).replace(/,/g, "")
          );
          setTahapan(parseFormatter);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <Spin indicator={antIcon} />
      </div>
    );

  return (
    <div className={styles.container}>
      <Card className={`${styles.card} ${styles.lastinput}`}>
        <div className={styles["card-container"]}>
          <p>Input laporan terakhir:</p>
          <p className={styles.lastDate}>{lastInputDate}</p>
        </div>
      </Card>
      <div className={styles.data}>
        <Card
          className={`${styles.card} ${styles["card--data"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Total input laporan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${totalInput}`}</p>
          </div>
        </Card>
        <Card
          className={`${styles.card} ${styles["card--data"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Laporan dengan keluhan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${keluhan}`}</p>
          </div>
        </Card>
        <Card
          className={`${styles.card} ${styles["card--data"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Laporan diberikan saran"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${saran}`}</p>
          </div>
        </Card>
        <Card
          className={`${styles.card} ${styles["card--data"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[{ value: `${tahapan}`, color: "#1890FF" }]}
              totalValue={100}
              lineWidth={20}
              label={({ dataEntry }) => `${dataEntry.value}%`}
              labelStyle={{
                fontSize: "25px",
                fill: "#1890FF"
              }}
              labelPosition={0}
              startAngle={90}
              animate
              background="#bfbfbf"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardFieldstaff;
