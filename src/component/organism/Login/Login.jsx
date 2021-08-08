/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import authRL from "../../../redux/logic/authRL";
import users from "../../../constant/user";

import styles from "./index.module.css";
import kanwilAPI from "../../../api/kanwilAPI";
import kantahAPI from "../../../api/kantahAPI";
import fieldstaffAPI from "../../../api/fieldstaffAPI";
import {
  convertObjectToArray,
  findValueOnArray
} from "../../../helpers/arrayHelper";

const title = "Silahkan Masuk";

const { Option } = Select;

const Login = () => {
  const arrUser = convertObjectToArray(users);
  const [selectedUser, setSelectedUser] = useState("");
  const [isIncorrectLogin, setIncorrectLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = (username, level, userId, name) => {
    return authRL.loginAdmin(username, level, userId, name).then(() => {
      setIncorrectLogin(false);
      setIsLoading(false);
      router.push("/dashboard");
    });
  };

  const incorrectLoginAndFinishLoading = () => {
    setIncorrectLogin(true);
    setIsLoading(false);
  };

  const setLoginAdmin = (username, password) => {
    if (selectedUser === users.Kanwil) {
      return kanwilAPI.getAllKanwil().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Kanwil, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (selectedUser === users.Kantah) {
      return kantahAPI.getAllKantah().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Kantah, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (selectedUser === users.Fieldstaff) {
      return fieldstaffAPI.getAllFieldstaff().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Fieldstaff, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (selectedUser === users.SuperAdmin) {
      if (username === "superadmin" && password === "admin")
        return login(username, password, users.SuperAdmin, "superadmin");
      return incorrectLoginAndFinishLoading();
    }
    return incorrectLoginAndFinishLoading();
  };

  const onFinish = values => {
    setIsLoading(true);
    const { username, password } = values;
    const userLogin = username.toLowerCase();
    setLoginAdmin(userLogin, password);
  };

  const onFinishFailed = errorInfo => {
    return errorInfo;
  };

  const handleMenuClick = e => {
    setSelectedUser(e);
  };

  return (
    <Card
      style={{
        width: 400,
        boxShadow: "0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%)"
      }}
    >
      <div className={styles.header}>
        <h1>{title}</h1>

        <Select
          defaultValue={arrUser[0]}
          style={{ width: 150 }}
          onChange={handleMenuClick}
        >
          {arrUser.map((val, i) => {
            return (
              <Option key={i.toString()} value={val} disabled={i === 0}>
                {val}
              </Option>
            );
          })}
        </Select>
      </div>

      {isIncorrectLogin && (
        <p className={styles.warning}>Username atau Emailmu salah</p>
      )}
      {selectedUser && (
        <div className={styles.main}>
          <Form
            name="login"
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Tolong masukan username"
                }
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Tolong masukan password"
                }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
                block
              >
                Masuk
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default Login;
