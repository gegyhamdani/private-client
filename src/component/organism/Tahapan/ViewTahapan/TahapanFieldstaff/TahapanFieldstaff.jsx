import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Spin, Button } from "antd";
import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import tahapanAPI from "../../../../../api/tahapanAPI";
import fieldstaffAPI from "../../../../../api/fieldstaffAPI";
import users from "../../../../../constant/user";

import styles from "./index.module.css";

const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const TahapanFieldstaff = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const router = useRouter();

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);

  const getTahapanData = id => {
    return new Promise(resolve => {
      tahapanAPI
        .getUserTahapan(id)
        .then(res => {
          if (res.length > 0) {
            fieldstaffAPI.getFieldstaff(userId).then(resFS => {
              res[0].target = resFS.target;
              resolve(res);
            });
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const getFieldstaffTahapan = () => {
    getTahapanData(userId).then(res => {
      if (res.length === 0) setLoading(false);
      setInitData(res);
      setEmptyData(res.length === 0);
    });
  };

  const getTahapan = () => {
    setLoading(true);
    return getFieldstaffTahapan();
  };

  useEffect(() => {
    getTahapan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLevel, userId]);

  useEffect(() => {
    if (initData.length > 0) {
      const flattenData = initData.flat();
      setData(flattenData);
      setLoading(false);
    }
    if (emptyData) {
      setData([]);
      setLoading(false);
      setEmptyData(false);
    }
  }, [initData, emptyData]);

  return (
    <>
      <div className={styles.field}>
        {userLevel === users.Fieldstaff && (
          <Button
            type="primary"
            style={{ width: 200 }}
            icon={<PlusCircleOutlined style={{ fontSize: "18px" }} />}
            className={styles.button}
            onClick={() => {
              router.push("/inputtahapan");
            }}
          >
            Tambah Tahapan
          </Button>
        )}
      </div>
      {isLoading ? (
        <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
      ) : (
        <Table dataSource={data} rowKey="id">
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

export default TahapanFieldstaff;
