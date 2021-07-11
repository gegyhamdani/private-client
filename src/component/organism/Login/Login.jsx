/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Card, Dropdown, Menu, Form, Input, Button } from "antd";
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
    if (arrUser[selectedUser] === users.Kanwil) {
      return kanwilAPI.getKanwil().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Kanwil, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (arrUser[selectedUser] === users.Kantah) {
      return kantahAPI.getKantah().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Kantah, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (arrUser[selectedUser] === users.Fieldstaff) {
      return fieldstaffAPI.getFieldstaff().then(res => {
        const findUser = findValueOnArray(res, "username", username);
        const findPassword = findValueOnArray(res, "password", password);
        if (findUser && findPassword)
          return login(username, users.Fieldstaff, findUser.id, findUser.name);
        return incorrectLoginAndFinishLoading();
      });
    }
    if (arrUser[selectedUser] === users.SuperAdmin) {
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
    setSelectedUser(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {arrUser.map((val, i) => {
        return (
          <Menu.Item key={i.toString()} icon={<UserOutlined />}>
            {val}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <Card
      style={{
        width: 400,
        boxShadow: "0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%)"
      }}
    >
      <div className={styles.header}>
        <h1>{title}</h1>

        <Dropdown overlay={menu} placement="bottomCenter">
          <Button> Pilih Level User</Button>
        </Dropdown>
      </div>

      {isIncorrectLogin && (
        <p className={styles.warning}>Username atau Emailmu salah</p>
      )}
      {selectedUser && (
        <div className={styles.main}>
          <p className={styles["form-header"]}>
            User Login:
            <span className={styles.user}>{` ${arrUser[selectedUser]}`}</span>
          </p>
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
