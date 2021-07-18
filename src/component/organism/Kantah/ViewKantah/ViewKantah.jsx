import React, { useState, useEffect } from "react";
import { Table, Input, Spin, Space, Button, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import kantahAPI from "../../../../api/kantahAPI";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";

const { Search } = Input;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ViewKantah = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataKantah, setDataKantah] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isUpdate, setUpdate] = useState(false);

  const handleOkModal = () => {
    setConfirmLoading(true);
    kantahAPI
      .deleteKantah(dataKantah.id)
      .then(() => {
        setUpdate(true);
        setConfirmLoading(false);
      })
      .finally(() => setIsModalVisible(false));
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setDataKantah({});
  };

  const handleSearch = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData);
    const test = data.filter(obj => {
      return obj.name.toLowerCase().includes(val.toLowerCase());
    });
    return setData(test);
  };

  const handleDelete = val => {
    setIsModalVisible(true);
    setDataKantah(val);
  };

  const getKantah = () => {
    setLoading(true);
    kantahAPI
      .getKantah()
      .then(res => {
        const sort = res.sort((a, b) => b.id - a.id);
        const datas = [];
        const promises = [];
        sort.map(val => {
          return promises.push(
            fieldstaffAPI.getFieldstaffKantah(val.id).then(fsVal => {
              datas.push({ ...val, t_fs: fsVal.length });
            })
          );
        });
        return new Promise(resolve =>
          Promise.all(promises).then(() => resolve(datas))
        );
      })
      .then(val => setInitData(val))
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getKantah();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      getKantah();
    }
  }, [isUpdate]);

  useEffect(() => {
    if (initData.length > 0) {
      setData(initData);
      setLoading(false);
      setUpdate(false);
    }
  }, [initData]);

  return (
    <div className={styles.container}>
      <Search
        placeholder="Cari nama kantah"
        allowClear
        onSearch={handleSearch}
        style={{ width: 350, marginTop: "1em", marginBottom: "1em" }}
      />
      {isLoading ? (
        <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
      ) : (
        <>
          <Table dataSource={data} rowKey="id">
            <Column title="Nama" dataIndex="name" key="name" />
            <Column
              title="Total Fieldstaff"
              dataIndex="t_fs"
              key="t_fs"
              width="200px"
            />
            <Column
              title="Action"
              key="action"
              width="200px"
              render={datas => {
                return (
                  <Space>
                    <Button>Lihat</Button>
                    <Button danger onClick={() => handleDelete(datas)}>
                      Delete
                    </Button>
                  </Space>
                );
              }}
            />
          </Table>
          <Modal
            title={`Delete ${dataKantah.name}`}
            visible={isModalVisible}
            onOk={handleOkModal}
            onCancel={handleCancelModal}
            confirmLoading={confirmLoading}
          >
            <p>
              Apakah anda yakin akan menghapus data
              {` ${dataKantah.name} ?`}
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ViewKantah;
