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
import tahapanAPI from "../../../../api/tahapanAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const DashboardKantah = () => {
  const [dataFieldstaff, setDataFieldstaff] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [dataTahapan, setDataTahapan] = useState([]);
  const [keluhan, setKeluhan] = useState(0);
  const [saran, setSaran] = useState(0);
  const [lastInputDate, setLastInputDate] = useState("");
  const [totalLaporan, setTotalLaporan] = useState(0);
  const [pemetaan, setPemetaan] = useState(0);
  const [penyuluhan, setPenyuluhan] = useState(0);
  const [penyusunan, setPenyusunan] = useState(0);
  const [pendampingan, setPendampingan] = useState(0);
  const [evaluasi, setEvaluasi] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const level = useSelector(state => state.auth.level);
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

  const getDataLaporan = () => {
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
  };

  const getDataTahapan = () => {
    const promiseArray = [];

    dataFieldstaff.map(val => {
      const apiCall = tahapanAPI.getUserTahapan(val.id).then(res => {
        return res;
      });
      return promiseArray.push(apiCall);
    });

    Promise.all(promiseArray).then(data => {
      setDataTahapan(data.flat());
      if (data.flat().length === 0) setLoading(false);
    });
  };

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
      getDataLaporan();
      getDataTahapan();
    }
  }, [dataFieldstaff]);

  useEffect(() => {
    if (dataLaporan.length > 0) {
      const totalDataLaporan = dataLaporan.length;

      const sortInputData = dataLaporan.sort((a, b) => a.id - b.id);
      const inputDateData =
        sortInputData[sortInputData.length - 1].tanggal_input;
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

      setKeluhan(dataKeluhan.length);
      setSaran(dataSaran.length);
      setTotalLaporan(totalDataLaporan);
    }
  }, [dataLaporan]);

  useEffect(() => {
    if (dataTahapan.length > 0) {
      const merged = [];
      const objTahapan = {};

      dataTahapan.forEach((val, i) => {
        objTahapan[val.id_fieldstaff] = dataTahapan[i];
      });

      for (let i = 0; i < dataFieldstaff.length; i += 1) {
        merged.push({
          ...dataFieldstaff[i],
          kinerja: objTahapan[dataFieldstaff[i].id]
            ? objTahapan[dataFieldstaff[i].id]
            : {}
        });
      }

      let totalTarget = 0;
      let totalPemetaan = 0;
      let totalPenyuluhan = 0;
      let totalPenyusunan = 0;
      let totalPendampingan = 0;
      let totalEvaluasi = 0;

      merged.forEach(({ target, kinerja }) => {
        totalTarget += target || 0;
        totalPemetaan += kinerja.pemetaan ? kinerja.pemetaan : 0;
        totalPenyuluhan += kinerja.penyuluhan ? kinerja.penyuluhan : 0;
        totalPenyusunan += kinerja.penyusunan ? kinerja.penyusunan : 0;
        totalPendampingan += kinerja.pendampingan ? kinerja.pendampingan : 0;
        totalEvaluasi += kinerja.evaluasi ? kinerja.evaluasi : 0;
      });

      const percentagePemetaan = (totalPemetaan / totalTarget) * 100;
      const percentagePenyuluhan = (totalPenyuluhan / totalTarget) * 100;
      const percentagePenyusunan = (totalPenyusunan / totalTarget) * 100;
      const percentagePendampingan = (totalPendampingan / totalTarget) * 100;
      const percentageEvaluasi = (totalEvaluasi / totalTarget) * 100;

      setPemetaan(changeFormatNumber(percentagePemetaan));
      setPenyuluhan(changeFormatNumber(percentagePenyuluhan));
      setPenyusunan(changeFormatNumber(percentagePenyusunan));
      setPendampingan(changeFormatNumber(percentagePendampingan));
      setEvaluasi(changeFormatNumber(percentageEvaluasi));

      const getKinerjaFieldstaff = merged.map(fieldstaff => {
        return {
          ...fieldstaff,
          percentageTarget: changeFormatNumber(
            ((fieldstaff.kinerja.pemetaan +
              fieldstaff.kinerja.penyuluhan +
              fieldstaff.kinerja.penyusunan +
              fieldstaff.kinerja.pendampingan +
              fieldstaff.kinerja.evaluasi) /
              (fieldstaff.target * 5)) *
              100
          )
        };
      });

      const sortRanking = getKinerjaFieldstaff.sort(
        (a, b) => parseFloat(b.kinerja) - parseFloat(a.kinerja)
      );

      setRanking(sortRanking.slice(0, 5));
    } else {
      const sortFieldstaffById = dataFieldstaff.sort((a, b) => a.id - b.id);
      setRanking(sortFieldstaffById.slice(0, 5));
    }
  }, [dataTahapan]);

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
          title="Ranking kinerja fieldstaff"
        >
          <div className={`${styles["card-container"]} ${styles.kinerja}`}>
            <table className={styles.table}>
              <tbody>
                {ranking.map((val, i) => {
                  return (
                    <tr className={styles.tr} key={i.toString()}>
                      <th className={styles.td}>{i + 1}</th>
                      <td className={styles.td}>{val.name}</td>
                      <td className={styles.td}>
                        {`${val.percentageTarget ? val.percentageTarget : 0}%`}
                      </td>
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
          title="Total fieldstaff"
          style={{ width: 250 }}
        >
          <div
            className={`${styles["card-container"]} ${styles["total--fieldstaff"]}`}
          >
            <p>
              {`Total: ${
                dataFieldstaff.length > 0 ? dataFieldstaff.length : 0
              }`}
            </p>
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
              data={[{ value: `${pemetaan}`, color: "#1890FF" }]}
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
              data={[{ value: `${penyuluhan}`, color: "#1890FF" }]}
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
              data={[{ value: `${penyusunan}`, color: "#1890FF" }]}
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
                  value: pendampingan,
                  color: "#1890FF"
                }
              ]}
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
              data={[{ value: `${evaluasi}`, color: "#1890FF" }]}
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

export default DashboardKantah;
