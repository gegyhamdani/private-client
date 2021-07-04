/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const withAuthentication = WrappedComponent => {
  const HOCComponent = ({ ...props }) => {
    const router = useRouter();
    const { pathname } = router;
    const token = useSelector(state => state.auth.token);

    const validation = () => {
      const windowPathName = window.location.pathname;
      const firstIndex = windowPathName.indexOf("/");

      if (firstIndex) return "true";

      return null;
    };

    useEffect(() => {
      validation();
    }, [pathname]);

    return (
      <>
        <WrappedComponent {...props} />
      </>
    );
  };

  return HOCComponent;
};

export default withAuthentication;
