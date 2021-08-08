/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Spin } from "antd";
import { PieChart } from "react-minimal-pie-chart";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import users from "../../../../constant/user";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import laporanAPI from "../../../../api/laporanAPI";
import dateHelper from "../../../../helpers/dateHelper";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const DashboardKantah = () => {
  const [dataFieldstaff, setDataFieldstaff] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [keluhan, setKeluhan] = useState([]);
  const [saran, setSaran] = useState([]);
  const [lastInputDate, setLastInputDate] = useState("");
  const [totalLaporan, setTotalLaporan] = useState(0);
  const [tahapan, setTahapan] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const level = useSelector(state => state.auth.level);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    if (level === users.Kantah) {
      setLoading(true);
      fieldstaffAPI.getFieldstaffKantah(userId).then(res => {
        setDataFieldstaff(res);
        if (res.length === 0) setLoading(false);
      });
    }
  }, [level]);

  useEffect(() => {
    if (dataFieldstaff.length > 0) {
      const promiseArray = [];

      dataFieldstaff.map(val => {
        const apiCall = laporanAPI.getUserLaporan(val.id).then(res => {
          return res;
        });
        return promiseArray.push(apiCall);
      });

      Promise.all(promiseArray).then(data => {
        setDataLaporan(data.flat());
        if (data.flat().length === 0) setLoading(false);
      });
    }
  }, [dataFieldstaff]);

  useEffect(() => {
    if (dataLaporan.length > 0) {
      const totalDataLaporan = dataLaporan.length;

      const inputDateData = dataLaporan[dataLaporan.length - 1].tanggal_input;
      const convertedDateData = dateHelper.convertDate(inputDateData);
      setLastInputDate(convertedDateData);

      const dataKeluhan = dataLaporan
        .map(val => {
          return val.keluhan ? val.keluhan : "";
        })
        .filter(e => {
          return e;
        });
      const dataSaran = dataLaporan
        .map(val => {
          return val.saran ? val.saran : "";
        })
        .filter(e => {
          return e;
        });

      const dataTahapan = dataLaporan.map(val => JSON.parse(val.tahapan));
      const filterDataTahapan = dataTahapan.filter(val => {
        return val != null;
      });
      const percentDataTahapan =
        (filterDataTahapan.length / totalDataLaporan) * 100;
      const numFormatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 1
      });
      const parseFormatter = parseFloat(
        numFormatter.format(percentDataTahapan).replace(/,/g, "")
      );
      setTahapan(parseFormatter);

      setKeluhan(dataKeluhan.length);
      setSaran(dataSaran.length);
      setTotalLaporan(totalDataLaporan);

      const merged = dataFieldstaff.map(fieldstaff => {
        return {
          ...fieldstaff,
          laporan: dataLaporan
            .map(item => {
              if (item.id_fieldstaff === fieldstaff.id) {
                return { ...item };
              }
              return [];
            })
            .flat()
        };
      });

      const getTahapanPercent = merged.map(item1 => {
        const { length } = item1.laporan;
        const data = item1.laporan.map(val => JSON.parse(val.tahapan));
        const filter = data.filter(val => {
          return val != null;
        });
        const percent = (filter.length / length) * 100;
        const num = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1
        });
        const parse = parseFloat(num.format(percent).replace(/,/g, ""));
        return { ...item1, percentTahapan: Number.isNaN(parse) ? 0 : parse };
      });

      const sortRanking = getTahapanPercent.sort(
        (a, b) => parseFloat(b.percentTahapan) - parseFloat(a.percentTahapan)
      );

      setRanking(sortRanking.slice(0, 5));
    }
  }, [dataLaporan]);

  useEffect(() => {
    if (ranking.length > 0) {
      setLoading(false);
    }
  }, [ranking]);

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
      <div className={styles.bigData}>
        <Card
          className={`${styles.card} ${styles["card--data"]}`}
          headStyle={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
            display: "flex"
          }}
          title="Ranking Kinerja Fieldstaff"
        >
          <div className={`${styles["card-container"]} ${styles.kinerja}`}>
            <table className={styles.table}>
              <tbody>
                {ranking.map((val, i) => {
                  return (
                    <tr className={styles.tr} key={i.toString()}>
                      <th className={styles.td}>{i + 1}</th>
                      <td className={styles.td}>{val.name}</td>
                      <td className={styles.td}>{`${val.percentTahapan}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
        >
          <div className={`${styles["card-container"]} ${styles.kinerja}`}>
            <div className={styles["kinerja-wrapper"]}>
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
          </div>
        </Card>
      </div>
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
          title="Total fieldstaff"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>
              {`Total: ${
                dataFieldstaff.length > 0 ? dataFieldstaff.length : 0
              }`}
            </p>
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
          title="Total input laporan"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${totalLaporan}`}</p>
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
          title="Laporan dengan Keluhan"
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
          title="Laporan diberikan Saran"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${saran}`}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardKantah;
