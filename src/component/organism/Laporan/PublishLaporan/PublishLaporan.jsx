/* eslint-disable new-cap */
import React, { useState, useEffect } from "react";
import { Button, DatePicker, Table, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

import { useSelector } from "react-redux";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import dateHelper from "../../../../helpers/dateHelper";

const { RangePicker } = DatePicker;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const PublishLaporan = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector(state => state.auth.userId);

  const onChange = (value, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: errMsg,
      duration: 2
    });
  };

  const handleShowData = () => {
    if (!startDate || !endDate)
      return openNotificationError("Silahkan pilih tanggal terlebih dahulu");

    const resultData = data.filter(a => {
      const date = new Date(a.tanggal_laporan);
      const startDateDate = new Date(startDate);
      const endDateDate = new Date(endDate);
      return date >= startDateDate && date <= endDateDate;
    });
    const convertData = resultData.map(val => {
      const arrKegiatan = JSON.parse(val.kegiatan);
      const kegiatan = arrKegiatan
        .map(item => {
          return getKeyByValue(item, true);
        })
        .filter(item => item);

      return {
        ...val,
        tanggal_laporan: dateHelper.convertDate(val.tanggal_laporan),
        tanggal_input: dateHelper.convertDate(val.tanggal_input),
        kegiatan: kegiatan.join(", ")
      };
    });
    const sortData = convertData.sort((a, b) => b.id - a.id);
    return setFilterData(sortData);
  };

  const handleExport = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    const title = "Timesheet Field Staff";
    const nameFieldstaff = `Nama: ${data[0].fieldstaff_name}`;
    const periode = `Periode: ${startDate} -- ${endDate}`;
    const headers = [
      [
        "Tanggal Laporan",
        "Tanggal Input",
        "Kegiatan",
        "Deskripsi Kegiatan",
        "Peserta"
      ]
    ];

    const bodyData = filterData.map(val => [
      val.tanggal_laporan,
      val.tanggal_input,
      val.kegiatan,
      val.keterangan,
      val.peserta
    ]);

    const content = {
      startY: 110,
      head: headers,
      body: bodyData
    };

    doc.setFontSize(15);
    doc.text(title, 350, 35);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(nameFieldstaff, 40, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(periode, 40, 95);
    doc.autoTable(content);
    doc.save(`${data[0].fieldstaff_name} - report.pdf`);
  };

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      laporanAPI
        .getUserLaporan(userId)
        .then(res => {
          setData(res);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId]);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <Spin indicator={antIcon} />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <p>Pilih tanggal laporan</p>
        <RangePicker format="YYYY-MM-DD" onChange={onChange} />
      </div>
      <div className={`${styles.row} ${styles.row__margin}`}>
        <Button type="primary" onClick={handleShowData}>
          Tampilkan Data
        </Button>
        <Button
          type="primary"
          onClick={handleExport}
          disabled={filterData.length === 0}
        >
          Cetak Laporan
        </Button>
      </div>
      <div className={styles.table}>
        <Table dataSource={filterData} rowKey="id">
          <Column
            title="Tanggal Laporan"
            dataIndex="tanggal_laporan"
            key="tanggal_laporan"
          />
          <Column
            title="Tanggal Input"
            dataIndex="tanggal_input"
            key="tanggal_input"
          />
          <Column title="Kegiatan" dataIndex="kegiatan" key="kegiatan" />
          <Column
            title="Deskripsi Kegiatan"
            dataIndex="keterangan"
            key="keterangan"
          />
          <Column title="Peserta" dataIndex="peserta" key="peserta" />
        </Table>
      </div>
    </div>
  );
};

export default PublishLaporan;
