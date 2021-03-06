/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { PieChart } from "react-minimal-pie-chart";

import { useSelector } from "react-redux";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import dateHelper from "../../../../helpers/dateHelper";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import tahapanAPI from "../../../../api/tahapanAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const DashboardFieldstaff = () => {
  const [dataUser, setDataUser] = useState({});
  const [lastInputDate, setLastInputDate] = useState("");
  const [totalInput, setTotalInput] = useState(0);
  const [keluhan, setKeluhan] = useState(0);
  const [saran, setSaran] = useState(0);
  const [dataTahapan, setDataTahapan] = useState({});
  const [isLoading, setLoading] = useState(false);
  const userId = useSelector(state => state.auth.userId);

  const changeFormatNumber = data => {
    const numFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 1
    });
    const parseFormatter = parseFloat(
      numFormatter.format(data).replace(/,/g, "")
    );

    return parseFormatter || 0;
  };

  useEffect(() => {
    setLoading(true);
    fieldstaffAPI
      .getFieldstaff(userId)
      .then(res => setDataUser(res))
      .then(() =>
        laporanAPI.getUserLaporan(userId).then(res => {
          if (res.length > 0) {
            const totalData = res.length;

            const sortInputData = res.sort((a, b) => a.id - b.id);
            const inputDateData =
              sortInputData[sortInputData.length - 1].tanggal_input;
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
          }
        })
      )
      .then(() =>
        tahapanAPI
          .getUserTahapan(userId)
          .then(res => {
            if (res.length > 0) {
              setDataTahapan(res[0]);
            }
          })
          .catch(() => {
            setLoading(false);
          })
      )
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
      </div>
      <div className={styles.data}>
        <Card
          className={`${styles.card} ${styles["card--data--tahapan"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi pemetaan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[
                {
                  value: dataTahapan.pemetaan ? dataTahapan.pemetaan : 0,
                  color: "#1890FF"
                }
              ]}
              totalValue={dataUser.target ? dataUser.target : 0}
              lineWidth={20}
              label={({ dataEntry }) =>
                `${changeFormatNumber(dataEntry.percentage)}%`}
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
        <Card
          className={`${styles.card} ${styles["card--data--tahapan"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi penyuluhan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[
                {
                  value: dataTahapan.penyuluhan ? dataTahapan.penyuluhan : 0,
                  color: "#1890FF"
                }
              ]}
              totalValue={dataUser.target ? dataUser.target : 0}
              lineWidth={20}
              label={({ dataEntry }) =>
                `${changeFormatNumber(dataEntry.percentage)}%`}
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
        <Card
          className={`${styles.card} ${styles["card--data--tahapan"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi penyusunan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[
                {
                  value: dataTahapan.penyusunan ? dataTahapan.penyusunan : 0,
                  color: "#1890FF"
                }
              ]}
              totalValue={dataUser.target ? dataUser.target : 0}
              lineWidth={20}
              label={({ dataEntry }) =>
                `${changeFormatNumber(dataEntry.percentage)}%`}
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
        <Card
          className={`${styles.card} ${styles["card--data--tahapan"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi pendampingan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[
                {
                  value: dataTahapan.pendampingan
                    ? dataTahapan.pendampingan
                    : 0,
                  color: "#1890FF"
                }
              ]}
              totalValue={dataUser.target ? dataUser.target : 0}
              lineWidth={20}
              label={({ dataEntry }) =>
                `${changeFormatNumber(dataEntry.percentage)}%`}
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
        <Card
          className={`${styles.card} ${styles["card--data--tahapan"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          bodyStyle={{ height: "100%" }}
          title="Realisasi evaluasi"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <PieChart
              data={[
                {
                  value: dataTahapan.evaluasi ? dataTahapan.evaluasi : 0,
                  color: "#1890FF"
                }
              ]}
              totalValue={dataUser.target ? dataUser.target : 0}
              lineWidth={20}
              label={({ dataEntry }) =>
                `${changeFormatNumber(dataEntry.percentage)}%`}
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
