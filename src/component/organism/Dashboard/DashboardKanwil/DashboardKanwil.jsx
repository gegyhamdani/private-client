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
import kantahAPI from "../../../../api/kantahAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const DashboardKanwil = () => {
  const [dataKantah, setDataKantah] = useState([]);
  const [dataFieldstaff, setDataFieldstaff] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
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

  const filterData = data => data.filter(val => val);

  const changeFormatNumber = data => {
    const numFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 1
    });
    const parseFormatter = parseFloat(
      numFormatter.format(data).replace(/,/g, "")
    );

    return parseFormatter;
  };

  const getTotal = data => {
    const maxScore = data.length * 100;

    let total = 0;
    for (let i = 0; i < data.length; i += 1) {
      total += data[i].kinerja;
    }

    const totalScore = (total / maxScore) * 100;
    return changeFormatNumber(totalScore) || 0;
  };

  useEffect(() => {
    if (level === users.Kanwil) {
      setLoading(true);
      kantahAPI.getAllKantah().then(res => {
        setDataKantah(res);
        if (res.length === 0) setLoading(false);
      });
    }
  }, [level]);

  useEffect(() => {
    if (dataKantah.length > 0) {
      const getData = async () => {
        const fieldstaffKanwil = await fieldstaffAPI.getFieldstaffKanwil(
          userId
        );
        const kantahData = await kantahAPI.getKantah();

        const dataPromises = kantahData.map(async item => {
          const fieldstaffKantah = await fieldstaffAPI.getFieldstaffKantah(
            item.id
          );
          return fieldstaffKantah;
        });

        const datas = await Promise.all(dataPromises);
        const flattenValue = datas.flat(1);
        const mergeData = [...flattenValue, ...fieldstaffKanwil];
        setDataFieldstaff(mergeData);
        if (mergeData.length === 0) setLoading(false);
      };

      getData();
    }
  }, [dataKantah]);

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
      setTotalLaporan(totalDataLaporan);

      const inputDateData = dataLaporan[dataLaporan.length - 1].tanggal_input;
      const convertedDateData = dateHelper.convertDate(inputDateData);
      setLastInputDate(convertedDateData);

      const totalDataFieldstaff = dataFieldstaff.length;
      const fieldstaffPemetaan = dataFieldstaff.map(val => val.pemetaan);
      const fieldstaffPenyuluhan = dataFieldstaff.map(val => val.penyuluhan);
      const fieldstaffpenyusunan = dataFieldstaff.map(val => val.penyusunan);
      const fieldstaffPendampingan = dataFieldstaff.map(
        val => val.pendampingan
      );
      const fieldstaffEvaluasi = dataFieldstaff.map(val => val.evaluasi);

      const filterFieldstaffPemetaan = filterData(fieldstaffPemetaan);
      const filterFieldstaffPenyuluhan = filterData(fieldstaffPenyuluhan);
      const filterFieldstaffPenyusunan = filterData(fieldstaffpenyusunan);
      const filterFieldstaffPendampingan = filterData(fieldstaffPendampingan);
      const filterFieldstaffEvaluasi = filterData(fieldstaffEvaluasi);

      const percentPemetaan =
        (filterFieldstaffPemetaan.length / totalDataFieldstaff) * 100;
      const percentPenyuluhan =
        (filterFieldstaffPenyuluhan.length / totalDataFieldstaff) * 100;
      const percentPenyusunan =
        (filterFieldstaffPenyusunan.length / totalDataFieldstaff) * 100;
      const percentPendampingan =
        (filterFieldstaffPendampingan.length / totalDataFieldstaff) * 100;
      const percentEvalusi =
        (filterFieldstaffEvaluasi.length / totalDataFieldstaff) * 100;

      setPemetaan(changeFormatNumber(percentPemetaan));
      setPenyuluhan(changeFormatNumber(percentPenyuluhan));
      setPenyusunan(changeFormatNumber(percentPenyusunan));
      setPendampingan(changeFormatNumber(percentPendampingan));
      setEvaluasi(changeFormatNumber(percentEvalusi));

      const mergeKantahFS = dataKantah.map(val => {
        return {
          ...val,
          dataFieldstaff: dataFieldstaff.filter(key => key.id_kantah === val.id)
        };
      });

      const manipulateKantahFS = mergeKantahFS.map(val => {
        return {
          kantahName: val.name,
          kinerja: val.dataFieldstaff.map(fieldstaff => {
            return {
              fsName: fieldstaff.name,
              kinerja: changeFormatNumber(
                (filterData([
                  fieldstaff.pemetaan,
                  fieldstaff.pendampingan,
                  fieldstaff.penyuluhan,
                  fieldstaff.penyusunan,
                  fieldstaff.evaluasi
                ]).length /
                  5) *
                  100
              )
            };
          })
        };
      });

      const kinerjaData = manipulateKantahFS.map(val => {
        return {
          kantahName: val.kantahName,
          kinerja: getTotal(val.kinerja)
        };
      });

      const sortRanking = kinerjaData.sort((a, b) => b.kinerja - a.kinerja);

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
          title="Ranking kinerja kantah"
        >
          <div className={`${styles["card-container"]} ${styles.kinerja}`}>
            <table className={styles.table}>
              <tbody>
                {ranking.map((val, i) => {
                  return (
                    <tr className={styles.tr} key={i.toString()}>
                      <th className={styles.td}>{i + 1}</th>
                      <td className={styles.td}>{val.kantahName}</td>
                      <td className={styles.td}>{`${val.kinerja}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          title="Total kantah"
          style={{ width: 250 }}
        >
          <div className={`${styles["card-container"]} ${styles.total}`}>
            <p>{`Total: ${dataKantah.length > 0 ? dataKantah.length : 0}`}</p>
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

export default DashboardKanwil;
