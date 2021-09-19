/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import fieldstaffAPI from "../../../../../api/fieldstaffAPI";
import tahapanAPI from "../../../../../api/tahapanAPI";

import styles from "./index.module.css";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const { Column } = Table;

const emptyData = {
  pemetaan: 0,
  penyuluhan: 0,
  penyusunan: 0,
  pendampingan: 0,
  evaluasi: 0
};

const TahapanKantah = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);

  const getTahapan = async () => {
    setLoading(true);

    const fieldstaff = await fieldstaffAPI.getFieldstaffKantah(userId);
    if (fieldstaff.length === 0) {
      setLoading(false);
    } else {
      const dataPromises = fieldstaff.map(async item => {
        const fieldstaffKantah = await tahapanAPI.getUserTahapan(item.id);
        return fieldstaffKantah;
      });
      const datas = await Promise.all(dataPromises);
      const flattenData = datas.flat(1);

      const merged = [];
      const objTahapan = {};

      flattenData.forEach((val, i) => {
        objTahapan[val.id_fieldstaff] = flattenData[i];
      });

      for (let i = 0; i < fieldstaff.length; i += 1) {
        merged.push({
          ...fieldstaff[i],
          kinerja: objTahapan[fieldstaff[i].id]
            ? objTahapan[fieldstaff[i].id]
            : emptyData
        });
      }

      const sortData = merged.sort((a, b) => b.id - a.id);

      setData(sortData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTahapan();
  }, [userLevel, userId]);

  return (
    <>
      {isLoading ? (
        <Spin
          indicator={antIcon}
          style={{ marginTop: "5em", marginLeft: "25em" }}
        />
      ) : (
        <Table
          dataSource={data}
          rowKey="id"
          summary={pageData => {
            let totalTarget = 0;
            let totalPemetaan = 0;
            let totalPenyuluhan = 0;
            let totalPenyusunan = 0;
            let totalPendampingan = 0;
            let totalEvaluasi = 0;

            pageData.forEach(({ target, kinerja }) => {
              totalTarget += target || 0;
              totalPemetaan += kinerja.pemetaan ? kinerja.pemetaan : 0;
              totalPenyuluhan += kinerja.penyuluhan ? kinerja.penyuluhan : 0;
              totalPenyusunan += kinerja.penyusunan ? kinerja.penyusunan : 0;
              totalPendampingan += kinerja.pendampingan
                ? kinerja.pendampingan
                : 0;
              totalEvaluasi += kinerja.evaluasi ? kinerja.evaluasi : 0;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell className={styles.summary}>
                    Total
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalTarget}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalPemetaan}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalPenyuluhan}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalPenyusunan}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalPendampingan}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className={styles.summary}>
                    {totalEvaluasi}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        >
          <Column title="Nama Fieldstaff" dataIndex="name" key="name" />
          <Column title="Total" dataIndex="target" key="target" />
          <Column
            title="Pemetaan Sosial"
            dataIndex={["kinerja", "pemetaan"]}
            key={["kinerja", "pemetaan"]}
          />
          <Column
            title="Penyuluhan"
            dataIndex={["kinerja", "penyuluhan"]}
            key={["kinerja", "penyuluhan"]}
          />
          <Column
            title="Penyusunan Model"
            dataIndex={["kinerja", "penyusunan"]}
            key={["kinerja", "penyusunan"]}
          />
          <Column
            title="Pendampingan"
            dataIndex={["kinerja", "pendampingan"]}
            key={["kinerja", "pendampingan"]}
          />
          <Column
            title="Evaluasi dan Pelaporan"
            dataIndex={["kinerja", "evaluasi"]}
            key={["kinerja", "evaluasi"]}
          />
        </Table>
      )}
    </>
  );
};

export default TahapanKantah;
