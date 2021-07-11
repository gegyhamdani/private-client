import React from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import menu from "../../../constant/menu";
import authRL from "../../../redux/logic/authRL";
import users from "../../../constant/user";

import styles from "./index.module.css";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const DashboardTemplate = ({ children }) => {
  const router = useRouter();

  const userLevel = useSelector(state => state.auth.level);
  const username = useSelector(state => state.auth.username);

  const setLogout = () => {
    return authRL.logoutAdmin().then(() => {
      router.push("/");
    });
  };

  const validateLevel = menuItem => {
    if (
      menuItem.level[0] === "all" ||
      menuItem.level.indexOf(userLevel) > -1 ||
      userLevel === users.SuperAdmin
    )
      return true;
    return false;
  };

  const menuLevel = item => {
    if (validateLevel(item)) {
      return (
        <Menu.Item key={item.key}>
          <Link key={item.key} href={`/${item.page}`}>
            {item.title}
          </Link>
        </Menu.Item>
      );
    }
    return null;
  };

  const subMenuLevel = item => {
    if (validateLevel(item)) {
      return (
        <SubMenu key={item.key} title={item.title}>
          {item.subMenu.map(subItem => {
            // eslint-disable-next-line prettier/prettier
            return validateLevel(subItem) ? (
              <Menu.Item key={subItem.key}>
                <Link href={`/${subItem.page}`} key={subItem.key}>
                  {subItem.title}
                </Link>
              </Menu.Item>
            ) : null;
          })}
        </SubMenu>
      );
    }
    return null;
  };

  const menuItem = () => {
    return menu.map(item => {
      return item.subMenu.length === 0 ? menuLevel(item) : subMenuLevel(item);
    });
  };

  const logoutItem = () => {
    return (
      <Menu>
        <Menu.Item key="0">
          <button
            type="button"
            className={styles.unstyle__button}
            onClick={setLogout}
          >
            Logout
          </button>
        </Menu.Item>
      </Menu>
    );
  };

  const footerItem = () => {
    return (
      <span>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Copyright © <span>{new Date().getFullYear()}</span> Kantor Wilayah
        Provinsi Kalimantan Barat.
      </span>
    );
  };

  return (
    <Layout className={styles.container}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={() => {}}
        onCollapse={() => {}}
      >
        <div className={styles.logo}>
          <Image
            src="/Logo-3.png"
            alt="Kementrian"
            width={44}
            height={43}
            quality="100"
          />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          {menuItem()}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <h4 className={styles.username}>
            Selamat datang kembali,
            <span className={styles.uppercase}>{` ${username}`}</span>
          </h4>
          <Dropdown
            overlay={logoutItem}
            trigger={["click"]}
            placement="bottomCenter"
            arrow
          >
            <button
              onClick={e => e.preventDefault()}
              type="button"
              className={`${styles.unstyle__button} ${styles.avatar__button}`}
            >
              <Avatar icon={<UserOutlined />} size={40} />
            </button>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div className={styles.layout__main}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>{footerItem()}</Footer>
      </Layout>
    </Layout>
  );
};

DashboardTemplate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
    PropTypes.shape({})
  ])
};

DashboardTemplate.defaultProps = {
  children: null
};

export default DashboardTemplate;
