import React, { useState, useEffect } from "react";
import { Table, Input, Spin, Space, Button, Modal, notification } from "antd";
import {
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from "@ant-design/icons";

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
  const [dataKantah, setDataKantah] = useState({});
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [isUpdate, setUpdate] = useState(false);

  const openNotificationSuccess = message => {
    notification.success({
      message,
      duration: 2
    });
  };

  const openNotificationError = message => {
    notification.error({
      message,
      duration: 2
    });
  };

  const handleOkModalDelete = () => {
    setConfirmLoadingDelete(true);
    kantahAPI
      .deleteKantah(dataKantah.id)
      .then(() => {
        openNotificationSuccess("Data berhasil di hapus");
        setUpdate(true);
        setConfirmLoadingDelete(false);
      })
      .finally(() => setIsModalDeleteVisible(false));
  };

  const handleOkModalUpdate = () => {
    if (
      dataKantah.name.length === 0 ||
      dataKantah.username.length === 0 ||
      dataKantah.password.length === 0
    ) {
      openNotificationError("Field tidak boleh kosong");
    } else {
      setConfirmLoadingUpdate(true);
      kantahAPI
        .updateKantah(
          dataKantah.id,
          dataKantah.name,
          dataKantah.username,
          dataKantah.password
        )
        .then(() => {
          openNotificationSuccess("Data berhasil diubah");
          setUpdate(true);
          setConfirmLoadingUpdate(false);
        })
        .finally(() => setIsModalUpdateVisible(false));
    }
  };

  const handleCancelModalDelete = () => {
    setIsModalDeleteVisible(false);
    setDataKantah({});
  };

  const handleCancelModalUpdate = () => {
    setIsModalUpdateVisible(false);
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
    setIsModalDeleteVisible(true);
    setDataKantah(val);
  };

  const handleUpdate = val => {
    setIsModalUpdateVisible(true);
    setDataKantah(val);
  };

  const handleChange = e => {
    const {
      target: { name, value }
    } = e;

    if (name === "name") {
      let clone = { ...dataKantah };
      clone = {
        ...clone,
        name: value
      };
      setDataKantah(clone);
    }
    if (name === "username") {
      let clone = { ...dataKantah };
      clone = {
        ...clone,
        username: value
      };
      setDataKantah(clone);
    }
    if (name === "password") {
      let clone = { ...dataKantah };
      clone = {
        ...clone,
        password: value
      };
      setDataKantah(clone);
    }
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
            <Column
              title="Nama"
              dataIndex="name"
              key="name"
              sorter={(a, b) => a.name.localeCompare(b.name)}
            />
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
                    <Button onClick={() => handleUpdate(datas)}>Lihat</Button>
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
            visible={isModalDeleteVisible}
            onOk={handleOkModalDelete}
            onCancel={handleCancelModalDelete}
            confirmLoading={confirmLoadingDelete}
          >
            <p>
              Apakah anda yakin akan menghapus data
              {` ${dataKantah.name} ?`}
            </p>
          </Modal>
          <Modal
            title={`Data ${dataKantah.name}`}
            visible={isModalUpdateVisible}
            onOk={handleOkModalUpdate}
            onCancel={handleCancelModalUpdate}
            confirmLoading={confirmLoadingUpdate}
            footer={[
              <Button key="back" onClick={handleCancelModalUpdate}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={confirmLoadingUpdate}
                onClick={handleOkModalUpdate}
              >
                Update
              </Button>
            ]}
          >
            <div className={styles.form__item}>
              <p>NAMA</p>
              <Input
                placeholder="Nama Kantah"
                value={dataKantah.name}
                onChange={handleChange}
                name="name"
              />
            </div>
            <div className={styles.form__item}>
              <p>USERNAME</p>
              <Input
                placeholder="Username Kantah"
                value={dataKantah.username}
                onChange={handleChange}
                name="username"
              />
            </div>
            <div className={styles.form__item}>
              <p>PASSWORD</p>
              <Input.Password
                iconRender={
                  visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  // eslint-disable-next-line react/jsx-curly-newline
                }
                placeholder="Password Kantah"
                value={dataKantah.password}
                onChange={handleChange}
                name="password"
              />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ViewKantah;
