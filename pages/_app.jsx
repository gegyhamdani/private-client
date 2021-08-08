/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import withRedux from "../src/component/hoc/withRedux";

import "../styles/globals.css";
import "antd/dist/antd.css";
import "jspdf-autotable";

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || React.Fragment;

  return (
    <>
      <Head>
        <title>Kantor Wilayah Provinsi Kalimantan Barat.</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired
};

export default withRedux(MyApp);
