import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, notification, Spin, InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";

import fieldstaffAPI from "../../../../api/fieldstaffAPI";
import kantahAPI from "../../../../api/kantahAPI";
import kanwilAPI from "../../../../api/kanwilAPI";
import users from "../../../../constant/user";
import { setName } from "../../../../redux/actions/auth";

import styles from "./index.module.css";

const { TextArea } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

const EditUser = () => {
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [form] = Form.useForm();
  const userId = useSelector(state => state.auth.userId);
  const userLevel = useSelector(state => state.auth.level);
  const dispatch = useDispatch();

  const changeUsername = useCallback(name => dispatch(setName(name)), [
    dispatch
  ]);

  const openNotificationSuccess = onSuccess => {
    notification.success({
      message: "Akun berhasil di update",
      duration: 2
    });
    setTimeout(() => onSuccess(), 1000);
  };

  const openNotificationError = errMsg => {
    notification.error({
      message: `Akun gagal di update${errMsg ? `, ${errMsg}` : ""}`,
      duration: 2
    });
  };

  const updateFieldstaff = data => {
    const { name, alamat, phone_number: phone, username, password } = data;
    fieldstaffAPI
      .updateFieldstaff(userId, name, alamat, phone, username, password)
      .then(() =>
        openNotificationSuccess(() => {
          changeUsername(name);
        })
      )
      .catch(() => openNotificationError());
  };

  const updateKanwil = data => {
    const { name, username, password } = data;
    kanwilAPI
      .updateKanwil(userId, name, username, password)
      .then(() =>
        openNotificationSuccess(() => {
          changeUsername(name);
        })
      )
      .catch(() => openNotificationError());
  };

  const updateKantah = data => {
    const {
      name,
      username,
      email,
      head_name: head,
      nip_head_name: nip,
      password
    } = data;
    kantahAPI
      .updateKantah(userId, name, username, password, email, head, nip)
      .then(() =>
        openNotificationSuccess(() => {
          changeUsername(name);
        })
      )
      .catch(() => openNotificationError());
  };

  const onFinish = fields => {
    if (userLevel === users.Fieldstaff) {
      updateFieldstaff(fields);
    }
    if (userLevel === users.Kanwil) {
      updateKanwil(fields);
    }
    if (userLevel === users.Kantah) {
      updateKantah(fields);
    }
  };

  useEffect(() => {
    if (userId && userLevel) {
      setLoading(true);
      if (userLevel === users.Fieldstaff) {
        fieldstaffAPI
          .getFieldstaff(userId)
          .then(res => {
            setUserData(res);
          })
          .finally(() => setLoading(false));
      }
      if (userLevel === users.Kanwil) {
        kanwilAPI
          .getKanwil(userId)
          .then(res => {
            setUserData(res);
          })
          .finally(() => setLoading(false));
      }
      if (userLevel === users.Kantah) {
        kantahAPI
          .getKantah(userId)
          .then(res => {
            setUserData(res);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [userId, userLevel]);

  return (
    <>
      {isLoading && isEmpty(userData) ? (
        <Spin indicator={antIcon} className={styles.loading} />
      ) : (
        <div className={styles.container}>
          <Form
            form={form}
            name="edit-account"
            className={styles.container__form}
            layout="vertical"
            initialValues={userData}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="NAMA"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Tolong masukan nama"
                }
              ]}
            >
              <Input />
            </Form.Item>

            {userLevel === users.Fieldstaff && (
              <Form.Item
                name="alamat"
                label="ALAMAT"
                labelAlign="left"
                rules={[
                  {
                    message: "Tolong masukan alamat"
                  }
                ]}
              >
                <TextArea />
              </Form.Item>
            )}

            {userLevel === users.Fieldstaff && (
              <Form.Item
                name="phone_number"
                label="NO. TELEPON"
                labelAlign="left"
                rules={[
                  {
                    type: "number",
                    message: "Tolong masukan no.telepon"
                  }
                ]}
                className={styles.form__phone}
              >
                <InputNumber />
              </Form.Item>
            )}

            <Form.Item
              name="username"
              label="USERNAME"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Tolong masukan username"
                }
              ]}
            >
              <Input />
            </Form.Item>

            {userLevel === users.Kantah && (
              <Form.Item
                name="email"
                label="EMAIL"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Tolong masukan email"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            )}

            {userLevel === users.Kantah && (
              <Form.Item
                name="head_name"
                label="KASI PENATAAN DAN PEMBERDAYAAN"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Tolong masukan kasi"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            )}

            {userLevel === users.Kantah && (
              <Form.Item
                name="nip_head_name"
                label="NIP"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Tolong masukan NIP"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              label="PASSWORD"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Tolong masukan password"
                }
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                UPDATE
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default EditUser;
