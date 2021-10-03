/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Modal, Button, Space, notification } from "antd";
import {
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import users from "../../../../constant/user";
import kantahAPI from "../../../../api/kantahAPI";
import dateHelper from "../../../../helpers/dateHelper";

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
  const router = useRouter();

  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);
  const userName = useSelector(state => state.auth.name);

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
    } else if (!/^\d+$/.test(dataFieldstaff.phone_number)) {
      openNotificationError("No. Telepon hanya boleh diisi angka");
    } else if (!/^\d+$/.test(dataFieldstaff.target)) {
      openNotificationError("Target hanya boleh diisi angka");
    } else {
      setConfirmLoadingUpdate(true);
      fieldstaffAPI
        .updateFieldstaff(
          dataFieldstaff.id,
          dataFieldstaff.name,
          dataFieldstaff.alamat,
          dataFieldstaff.phone_number,
          dataFieldstaff.target,
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

  const handleSearchFieldstaff = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData);
    const test = data.filter(obj => {
      return obj.name.toLowerCase().includes(val.toLowerCase());
    });
    return setData(test);
  };

  const handleSearchKantah = val => {
    if (initData.length === 0) return undefined;
    if (!val) return setData(initData);
    const test = data.filter(obj => {
      return obj.kantahName.toLowerCase().includes(val.toLowerCase());
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

  const handleChangeNumber = e => {
    const {
      target: { value }
    } = e;

    if (value.length > 13) return;

    let clone = { ...dataFieldstaff };
    clone = {
      ...clone,
      phone_number: value
    };
    setDataFieldstaff(clone);
  };

  const handleChangeTarget = e => {
    const {
      target: { value }
    } = e;

    if (value.length > 13) return;

    let clone = { ...dataFieldstaff };
    clone = {
      ...clone,
      target: value
    };
    setDataFieldstaff(clone);
  };

  const getFieldstaff = async () => {
    setLoading(true);
    if (userLevel === users.Kantah) {
      const fieldstaffKantah = await fieldstaffAPI.getFieldstaffKantah(userId);
      if (fieldstaffKantah.length === 0) {
        setLoading(false);
        setUpdate(false);
        setData();
      } else {
        const value = fieldstaffKantah.map(val => {
          return {
            ...val,
            date_born: dateHelper.convertDate(val.date_born)
          };
        });
        const sort = value.sort((a, b) => b.id - a.id);
        setInitData(sort);
        setLoading(false);
      }
    } else if (userLevel === users.Kanwil) {
      const fieldstaffKanwil = await fieldstaffAPI.getFieldstaffKanwil(userId);
      const kantahData = await kantahAPI.getKantah();

      const dataPromises = kantahData.map(async item => {
        const fieldstaffKantah = await fieldstaffAPI.getFieldstaffKantah(
          item.id
        );
        return {
          ...item,
          fieldstaffKantah
        };
      });

      const datas = await Promise.all(dataPromises);

      const updateValue = datas.map(fs => {
        const fsData = fs.fieldstaffKantah.map(val => {
          return {
            ...val,
            kantahName: fs.name,
            date_born: dateHelper.convertDate(val.date_born)
          };
        });
        return fsData;
      });

      const flattenValue = updateValue.flat(1);

      const updateValueKanwil = fieldstaffKanwil.map(val => {
        return {
          ...val,
          kantahName: userName,
          date_born: dateHelper.convertDate(val.date_born)
        };
      });

      const mergeData = [...flattenValue, ...updateValueKanwil];

      const sort = mergeData.sort((a, b) => b.id - a.id);

      setInitData(sort);
      setLoading(false);
    }
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
      <div className={styles.field}>
        <div className={styles.filter}>
          {userLevel === users.Kanwil && (
            <Search
              placeholder="Cari nama kantah"
              allowClear
              onSearch={handleSearchKantah}
              style={{ width: 350, marginBottom: "1em" }}
            />
          )}
          <Search
            placeholder="Cari nama fieldstaff"
            allowClear
            onSearch={handleSearchFieldstaff}
            style={{ width: 350 }}
          />
        </div>

        <Button
          type="primary"
          style={{ width: 200 }}
          icon={<PlusCircleOutlined style={{ fontSize: "18px" }} />}
          className={styles.button}
          onClick={() => {
            router.push("/inputfieldstaff");
          }}
        >
          Tambah Data Fieldstaff
        </Button>
      </div>
      {isLoading ? (
        <Spin indicator={antIcon} style={{ marginTop: "5em" }} />
      ) : (
        <>
          <div className={styles["table-container"]}>
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
                width="190px"
              />
              <Column title="Alamat" dataIndex="alamat" key="alamat" />
              <Column
                title="Target Fisik (KK)"
                dataIndex="target"
                key="target"
              />
              {userLevel === users.Kanwil && (
                <Column
                  title="Nama Kantah"
                  dataIndex="kantahName"
                  key="kantahName"
                />
              )}
              <Column
                title="Action"
                key="action"
                width="200px"
                render={datas => {
                  return (
                    <Space>
                      <Button
                        onClick={() => handleUpdate(datas)}
                        icon={<SearchOutlined />}
                      >
                        Lihat
                      </Button>
                      <Button
                        danger
                        onClick={() => handleDelete(datas)}
                        icon={<DeleteOutlined />}
                      >
                        Delete
                      </Button>
                    </Space>
                  );
                }}
              />
            </Table>
          </div>
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
                onChange={handleChangeNumber}
                name="phone_number"
                addonBefore="0"
              />
            </div>
            <div className={styles.form__item}>
              <p>TARGET FISIK (KK)</p>
              <Input
                placeholder="Target Fisik (KK)"
                value={dataFieldstaff.target}
                onChange={handleChangeTarget}
                name="target"
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
