/* eslint-disable new-cap */
import React, { useState, useEffect } from "react";
import { Button, DatePicker, Table, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

import { useSelector } from "react-redux";
import styles from "./index.module.css";
import dateHelper from "../../../../helpers/dateHelper";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import kantahAPI from "../../../../api/kantahAPI";
import kanwilAPI from "../../../../api/kanwilAPI";
import rencanaAPI from "../../../../api/rencanaAPI";

const { RangePicker } = DatePicker;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const PublishRencana = () => {
  const [data, setData] = useState([]);
  const [headData, setHeadData] = useState({});
  const [filterData, setFilterData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFilterData, setIsLoadingFilterData] = useState(false);
  const userId = useSelector(state => state.auth.userId);

  const onChange = (value, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: errMsg,
      duration: 2
    });
  };

  const handleShowData = async () => {
    if (!startDate || !endDate)
      return openNotificationError("Silahkan pilih tanggal terlebih dahulu");

    setIsLoadingFilterData(true);

    const resultData = await data.filter(a => {
      const date = new Date(a.periode);
      const startDateDate = new Date(startDate);
      const endDateDate = new Date(endDate);
      return date >= startDateDate && date <= endDateDate;
    });

    const convertData = await resultData.map(val => {
      return {
        ...val,
        periode: dateHelper.convertMonthDate(val.periode)
      };
    });
    const sortData = await convertData.sort((a, b) => b.id - a.id);

    setIsLoadingFilterData(false);
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

    const number = 1.76389241667;
    doc.page = 1;

    doc.setFontSize(15);
    doc.text(title, 350, 35);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(nameFieldstaff, 40, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(periode, 40, 95);
    doc.autoTable({
      startY: 110,
      html: "#mytable",
      bodyStyles: { minCellHeight: 60 },
      didDrawCell(datas) {
        if (
          datas.column.index === 4 &&
          datas.cell.section === "body" &&
          datas.cell.raw.getElementsByTagName("img")[0] !== undefined
        ) {
          const td = datas.cell.raw;
          const img = td.getElementsByTagName("img")[0];
          const dim = datas.cell.height - datas.cell.padding("vertical");
          const { x, y } = datas.cell;
          doc.addImage(img.src, x + number, y + number, dim, dim);
        }
      }
    });

    const footer = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setFont(undefined, "normal");

        doc.text("Disusun oleh,", 40, 460);
        doc.text("Tenaga Ahli Field Staff", 40, 470);
        doc.text(data[0].fieldstaff_name, 40, 540);
        doc.text("Field staff", 40, 550);

        doc.text("Diketahui oleh,", 600, 460);
        doc.text("Kasi Pemberdayaan Hak atas Tanah", 600, 470);
        doc.text("Masyarakat", 600, 480);
        doc.text(headData.head_name ? headData.head_name : "Kasi", 600, 540);
        doc.text(
          headData.nip_head_name ? `NIP: ${headData.nip_head_name}` : "NIP: -",
          600,
          550
        );
      }
    };

    footer();
    doc.save(`Rencana Bulanan - ${data[0].fieldstaff_name}.pdf`);
  };

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      rencanaAPI
        .getUserRencana(userId)
        .then(res => {
          return setData(res);
        })
        .then(() => {
          return fieldstaffAPI.getFieldstaff(userId);
        })
        .then(resFS => {
          if (resFS.id_kanwil === 0) {
            return kantahAPI.getKantah(resFS.id_kantah);
          }
          return kanwilAPI.getKanwil(resFS.id_kanwil);
        })
        .then(resFSK => {
          setHeadData(resFSK);
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
        <p>Pilih tanggal rencana bulanan</p>
        <RangePicker format="YYYY-MM" onChange={onChange} picker="month" />
      </div>
      <div className={`${styles.row} ${styles.row__margin}`}>
        <Button
          type="primary"
          onClick={handleShowData}
          loading={isLoadingFilterData}
        >
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
        {isLoadingFilterData ? (
          <div className={styles.loading}>
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <Table dataSource={filterData} rowKey="id">
            <Column title="Periode" dataIndex="periode" key="periode" />
            <Column title="Lokasi" dataIndex="lokasi" key="lokasi" />
            <Column
              title="Rencana Tindak Lanjut"
              dataIndex="tindak_lanjut"
              key="tindak_lanjut"
            />
          </Table>
        )}
        <table id="mytable" style={{ display: "none" }}>
          <thead>
            <tr>
              <th>Periode</th>
              <th>Lokasi</th>
              <th>Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {filterData &&
              filterData.map((val, i) => {
                return (
                  <tr key={i.toString()}>
                    <td>{val.periode}</td>
                    <td>{val.lokasi}</td>
                    <td>{val.tindak_lanjut}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublishRencana;
