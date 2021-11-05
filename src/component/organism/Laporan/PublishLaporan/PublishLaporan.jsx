/* eslint-disable new-cap */
import React, { useState, useEffect } from "react";
import { Button, DatePicker, Table, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

import { useSelector } from "react-redux";
import styles from "./index.module.css";
import laporanAPI from "../../../../api/laporanAPI";
import dateHelper from "../../../../helpers/dateHelper";
import imageAPI from "../../../../api/imageAPI";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import kantahAPI from "../../../../api/kantahAPI";
import kanwilAPI from "../../../../api/kanwilAPI";

const { RangePicker } = DatePicker;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const PublishLaporan = () => {
  const [data, setData] = useState([]);
  const [headData, setHeadData] = useState({});
  const [filterData, setFilterData] = useState([]);
  const [filterDataKeluhan, setFilterDataKeluhan] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFilterData, setIsLoadingFilterData] = useState(false);
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

  const getConvertedImage = val => {
    return `data:image/png;base64,${val}`;
  };

  const getImage = image => {
    if (image.length > 0) {
      return image.map((val, i) => (
        <img
          src={getConvertedImage(val)}
          alt="laporan"
          key={i.toString()}
          className={styles.img}
        />
      ));
    }
    return null;
  };

  const getPhoto = async endData => {
    const dataPhoto = endData.map(async item => {
      const endpoint = item.foto.map(async foto => {
        const apiResult = await imageAPI.getImage(foto);
        // eslint-disable-next-line new-cap
        return new Buffer.from(apiResult.img.data).toString("base64");
      });
      const photoResult = await Promise.all(endpoint);

      return { ...item, foto: photoResult };
    });
    return Promise.all(dataPhoto);
  };

  const handleShowData = async () => {
    if (!startDate || !endDate)
      return openNotificationError("Silahkan pilih tanggal terlebih dahulu");

    setIsLoadingFilterData(true);

    const dataByDate = await data.filter(a => {
      const date = new Date(a.tanggal_laporan);
      const startDateDate = new Date(startDate);
      const endDateDate = new Date(endDate);
      return date >= startDateDate && date <= endDateDate;
    });

    const shortByDate = dataByDate.sort(
      (a, b) => new Date(b.tanggal_laporan) - new Date(a.tanggal_laporan)
    );

    const convertData = await shortByDate.map(val => {
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
        kegiatan: kegiatan.join(", "),
        foto: JSON.parse(val.foto)
      };
    });

    const listImage = await getPhoto(convertData);

    const cloneData = [...listImage];
    const dataWithKeluhan = cloneData.filter(x => x.keluhan);

    setIsLoadingFilterData(false);
    setFilterDataKeluhan(dataWithKeluhan);
    return setFilterData(listImage);
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
      bodyStyles: { minCellHeight: 40 },
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
      },
      tableWidth: "auto",
      columnWidth: "wrap",
      columnStyles: {
        0: { columnWidth: 100 },
        1: { columnWidth: 120 },
        2: { columnWidth: 290 },
        3: { columnWidth: 140 },
        4: { columnWidth: "auto" }
      }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 40,
      html: "#myother",
      pageBreak: "always",
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
        doc.text("Kasi Penataan dan Pemberdayaan", 600, 470);
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
    doc.save(`${data[0].fieldstaff_name} - report.pdf`);
  };

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      laporanAPI
        .getUserLaporan(userId)
        .then(res => {
          return setData(res);
        })
        .then(() => {
          return fieldstaffAPI.getFieldstaff(userId);
        })
        .then(resFS => {
          if (resFS.id_kanwil === 0 || resFS.id_kanwil === null) {
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
        <p>Pilih tanggal laporan</p>
        <RangePicker onChange={onChange} format="YYYY-MM-DD" />
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
            <Column
              title="Tanggal Laporan"
              dataIndex="tanggal_laporan"
              key="tanggal_laporan"
              width="170px"
            />
            <Column
              title="Kegiatan"
              dataIndex="kegiatan"
              key="kegiatan"
              width="160px"
            />
            <Column
              title="Deskripsi Kegiatan"
              dataIndex="keterangan"
              key="keterangan"
              width="500px"
            />
            <Column
              title="Peserta"
              dataIndex="peserta"
              key="peserta"
              width="180px"
            />
            <Column
              title="Foto"
              dataIndex="foto"
              key="foto"
              render={res => getImage(res)}
            />
          </Table>
        )}
        <table id="mytable" style={{ display: "none" }}>
          <thead>
            <tr>
              <th>Tanggal Laporan</th>
              <th>Kegiatan</th>
              <th>Deskripsi Kegiatan</th>
              <th>Peserta</th>
              <th>Foto</th>
            </tr>
          </thead>
          <tbody>
            {filterData &&
              filterData.map((val, i) => {
                return (
                  <tr key={i.toString()}>
                    <td>{val.tanggal_laporan}</td>
                    <td>{val.kegiatan}</td>
                    <td>{val.keterangan}</td>
                    <td>{val.peserta}</td>
                    <td>{getImage(val.foto)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <table id="myother" style={{ display: "none" }}>
          <thead>
            <tr>
              <th>Keluhan</th>
              <th>Saran</th>
            </tr>
          </thead>
          <tbody>
            {filterDataKeluhan &&
              filterDataKeluhan.map((val, i) => {
                return (
                  <tr key={i.toString()}>
                    <td>{val.keluhan}</td>
                    <td>{val.saran}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublishLaporan;
