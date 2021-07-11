import {
  setAuthentication,
  setIsLogin,
  setToken,
  setLevel,
  setUsername,
  setLogout,
  setUserId,
  setName
} from "../actions/auth";
import store from "../store";

const { dispatch } = store;

/**
 * Dispatch setAuthentication action
 * @param {bool} auth current state of authenticating status
 */
const dispatchSetAuthentication = auth => {
  return Promise.resolve(dispatch(setAuthentication(auth)));
};

/**
 * Dispatch setToken action
 * @param {string} token session token of user login
 */
const dispatchSetToken = token => {
  return Promise.resolve(dispatch(setToken(token)));
};

/**
 * Dispatch setLogin action
 * @param {bool} login current state of login status
 */
const dispatchSetLogin = login => {
  return Promise.resolve(dispatch(setIsLogin(login)));
};

/**
 * Dispatch setLogin action
 * @param {string} level level admin
 */
const dispatchSetLevel = level => {
  return Promise.resolve(dispatch(setLevel(level)));
};

/**
 * Dispatch setUsername action
 * @param {string} username username admin
 */
const dispatchSetUsername = username => {
  return Promise.resolve(dispatch(setUsername(username)));
};

/**
 * Dispatch setUsername action
 * @param {string} userId userId admin
 */
const dispatchSetUserId = userId => {
  return Promise.resolve(dispatch(setUserId(userId)));
};

/**
 * Dispatch setUsername action
 * @param {string} name name admin
 */
const dispatchSetName = name => {
  return Promise.resolve(dispatch(setName(name)));
};

/**
 * Dispatch Logout action
 * @param {string} username username admin
 */
const dispatchLogout = () => {
  return Promise.resolve(dispatch(setLogout()));
};

/**
 * Validate login Admin
 * @param {string} username username input
 * @param {string} username level admin
 * @param {string} username user id input
 */
const loginAdmin = (username, level, userId, name) => {
  return new Promise((resolve, reject) => {
    dispatchSetAuthentication(true)
      .then(() => dispatchSetToken(1))
      .then(() => dispatchSetLevel(level))
      .then(() => dispatchSetUsername(username))
      .then(() => dispatchSetUserId(userId))
      .then(() => dispatchSetName(name))
      .then(() => dispatchSetAuthentication(false))
      .then(() => dispatchSetLogin(true))
      .then(() => resolve())
      .catch(() => {
        dispatchSetAuthentication(false);
        reject();
      });
  });
};

const logoutAdmin = () => {
  return new Promise((resolve, reject) => {
    dispatchSetAuthentication(true)
      .then(() => dispatchLogout())
      .then(() => resolve())
      .catch(() => {
        dispatchSetAuthentication(false);
        reject();
      });
  });
};

export default {
  loginAdmin,
  logoutAdmin
};
