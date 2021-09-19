/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import fieldstaffAPI from "../../../../../api/fieldstaffAPI";
import tahapanAPI from "../../../../../api/tahapanAPI";

import styles from "./index.module.css";
import kantahAPI from "../../../../../api/kantahAPI";

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const { Column } = Table;

const TahapanKanwil = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);

  const getTahapan = async () => {
    setLoading(true);
    const fieldstaffKanwil = await fieldstaffAPI.getFieldstaffKanwil(userId);
    const kantahData = await kantahAPI.getKantah();

    const kantahFieldstaffPromise = kantahData.map(async item => {
      const fieldstaff = await fieldstaffAPI.getFieldstaffKantah(item.id);
      return fieldstaff;
    });
    const kantahFieldstaffData = await Promise.all(kantahFieldstaffPromise);
    const fieldstaffData = kantahFieldstaffData.flat(1);
    const mergeData = [...fieldstaffData, ...fieldstaffKanwil];

    const dataPromises = mergeData.map(async item => {
      const fieldstaffKantah = await tahapanAPI.getUserTahapan(item.id);
      return fieldstaffKantah;
    });
    const datas = await Promise.all(dataPromises);
    const flattenData = datas.flat(1);

    const merged = [];
    const objFieldstaff = {};

    mergeData.forEach((e, i) => {
      objFieldstaff[e.id] = mergeData[i].target;
    });

    for (let i = 0; i < flattenData.length; i += 1) {
      merged.push({
        ...flattenData[i],
        target: objFieldstaff[flattenData[i].id_fieldstaff]
      });
    }

    const sortData = merged.sort((a, b) => b.id - a.id);

    setData(sortData);
    setLoading(false);
  };

  useEffect(() => {
    getTahapan();
  }, [userLevel, userId]);

  return (
    <>
      {isLoading ? (
        <Spin
          indicator={antIcon}
          style={{ marginTop: "5em", marginLeft: "15em" }}
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

            pageData.forEach(
              ({
                target,
                pemetaan,
                penyuluhan,
                penyusunan,
                pendampingan,
                evaluasi
              }) => {
                totalTarget += target;
                totalPemetaan += pemetaan;
                totalPenyuluhan += penyuluhan;
                totalPenyusunan += penyusunan;
                totalPendampingan += pendampingan;
                totalEvaluasi += evaluasi;
              }
            );

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
          <Column
            title="Nama Fieldstaff"
            dataIndex="fieldstaff_name"
            key="fieldstaff_name"
          />
          <Column title="Total" dataIndex="target" key="target" />
          <Column title="Pemetaan Sosial" dataIndex="pemetaan" key="pemetaan" />
          <Column title="Penyuluhan" dataIndex="penyuluhan" key="penyuluhan" />
          <Column
            title="Penyusunan Model"
            dataIndex="penyusunan"
            key="penyusunan"
          />
          <Column
            title="Pendampingan"
            dataIndex="pendampingan"
            key="pendampingan"
          />
          <Column
            title="Evaluasi dan Pelaporan"
            dataIndex="evaluasi"
            key="evaluasi"
          />
        </Table>
      )}
    </>
  );
};

export default TahapanKanwil;
