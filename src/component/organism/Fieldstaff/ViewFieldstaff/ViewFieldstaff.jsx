/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Modal, Button, Space, notification } from "antd";
import {
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from "@ant-design/icons";

import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";

const { Search, TextArea } = Input;
const { Column } = Table;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const ViewFieldstaff = () => {
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [dataFieldstaff, setDataFieldstaff] = useState({});
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [isUpdate, setUpdate] = useState(false);

  const userId = useSelector(state => state.auth.userId);

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
    fieldstaffAPI
      .deleteFieldstaff(dataFieldstaff.id)
      .then(() => {
        openNotificationSuccess("Data berhasil di hapus");
        setUpdate(true);
        setConfirmLoadingDelete(false);
      })
      .finally(() => setIsModalDeleteVisible(false));
  };

  const handleOkModalUpdate = () => {
    if (
      dataFieldstaff.name.length === 0 ||
      dataFieldstaff.username.length === 0 ||
      dataFieldstaff.password.length === 0
    ) {
      openNotificationError("Field tidak boleh kosong");
    } else {
      setConfirmLoadingUpdate(true);
      fieldstaffAPI
        .updateFieldstaff(
          dataFieldstaff.id,
          dataFieldstaff.name,
          dataFieldstaff.alamat,
          dataFieldstaff.phone_number,
          dataFieldstaff.username,
          dataFieldstaff.password
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
    setDataFieldstaff({});
  };

  const handleCancelModalUpdate = () => {
    setIsModalUpdateVisible(false);
    setDataFieldstaff({});
  };

  const handleSearch = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData);
    const test = data.filter(obj => {
      return obj.name.toLowerCase().includes(val.toLowerCase());
    });
    return setData(test);
  };

  const handleUpdate = val => {
    setIsModalUpdateVisible(true);
    setDataFieldstaff(val);
  };

  const handleDelete = val => {
    setIsModalDeleteVisible(true);
    setDataFieldstaff(val);
  };

  const handleChange = e => {
    const {
      target: { name, value }
    } = e;

    if (name === "name") {
      let clone = { ...dataFieldstaff };
      clone = {
        ...clone,
        name: value
      };
      setDataFieldstaff(clone);
    }
    if (name === "username") {
      let clone = { ...dataFieldstaff };
      clone = {
        ...clone,
        username: value
      };
      setDataFieldstaff(clone);
    }
    if (name === "password") {
      let clone = { ...dataFieldstaff };
      clone = {
        ...clone,
        password: value
      };
      setDataFieldstaff(clone);
    }
    if (name === "alamat") {
      let clone = { ...dataFieldstaff };
      clone = {
        ...clone,
        alamat: value
      };
      setDataFieldstaff(clone);
    }
    if (name === "phone_number") {
      let clone = { ...dataFieldstaff };
      clone = {
        ...clone,
        phone_number: value
      };
      setDataFieldstaff(clone);
    }
  };

  const getFieldstaff = () => {
    setLoading(true);
    fieldstaffAPI
      .getFieldstaffKantah(userId)
      .then(res => {
        const value = res.map(val => {
          const date = new Date(val.date_born);
          const dateDay =
            date.getDate().toString().length < 2
              ? `0${date.getDate()}`
              : date.getDate();
          const dateMonth = date.getMonth().toString().length
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
          return {
            ...val,
            date_born: `${dateDay} - ${dateMonth} - ${date.getFullYear()}`
          };
        });
        const sort = value.sort((a, b) => b.id - a.id);
        setInitData(sort);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getFieldstaff();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      getFieldstaff();
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
        placeholder="Cari nama fieldstaff"
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
              title="Tanggal Lahir"
              dataIndex="date_born"
              key="date_born"
            />
            <Column title="Alamat" dataIndex="alamat" key="alamat" />
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
            title={`Delete ${dataFieldstaff.name}`}
            visible={isModalDeleteVisible}
            onOk={handleOkModalDelete}
            onCancel={handleCancelModalDelete}
            confirmLoading={confirmLoadingDelete}
          >
            <p>
              Apakah anda yakin akan menghapus data
              {` ${dataFieldstaff.name} ?`}
            </p>
          </Modal>
          <Modal
            title={`Data ${dataFieldstaff.name}`}
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
                placeholder="Nama Fieldstaff"
                value={dataFieldstaff.name}
                onChange={handleChange}
                name="name"
              />
            </div>
            <div className={styles.form__item}>
              <p>ALAMAT</p>
              <TextArea
                placeholder="Alamat Fieldstaff"
                value={dataFieldstaff.alamat}
                onChange={handleChange}
                name="alamat"
              />
            </div>
            <div className={styles.form__item}>
              <p>NO. TELEPON</p>
              <Input
                placeholder="No. Telepon Fieldstaff"
                value={dataFieldstaff.phone_number}
                onChange={handleChange}
                name="phone_number"
              />
            </div>
            <div className={styles.form__item}>
              <p>USERNAME</p>
              <Input
                placeholder="Username Fieldstaff"
                value={dataFieldstaff.username}
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
                placeholder="Password Fieldstaff"
                value={dataFieldstaff.password}
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

export default ViewFieldstaff;
