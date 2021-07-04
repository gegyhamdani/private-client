/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../../../redux/store";

const withRedux = WrappedComponent => {
  return props => {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WrappedComponent {...props} />
        </PersistGate>
      </Provider>
    );
  };
};

export default withRedux;
