import { ACTION_TYPES_AUTH } from "../types";

const {
  SET_IS_LOGIN,
  SET_TOKEN,
  SET_IS_AUTHENTICATING,
  SET_LEVEL,
  SET_USERNAME,
  SET_USER_ID,
  SET_NAME,
  SET_LOGOUT
} = ACTION_TYPES_AUTH;

export const setIsLogin = isLogin => dispatch => {
  dispatch({
    type: SET_IS_LOGIN,
    isLogin
  });
  return Promise.resolve();
};

export const setToken = token => dispatch => {
  dispatch({
    type: SET_TOKEN,
    token
  });
  return Promise.resolve();
};

export const setAuthentication = isAuthenticating => dispatch => {
  dispatch({
    type: SET_IS_AUTHENTICATING,
    isAuthenticating
  });
  return Promise.resolve();
};

export const setLevel = level => dispatch => {
  dispatch({
    type: SET_LEVEL,
    level
  });
  return Promise.resolve();
};

export const setUsername = username => dispatch => {
  dispatch({
    type: SET_USERNAME,
    username
  });
  return Promise.resolve();
};

export const setUserId = userId => dispatch => {
  dispatch({
    type: SET_USER_ID,
    userId
  });
  return Promise.resolve();
};

export const setName = name => dispatch => {
  dispatch({
    type: SET_NAME,
    name
  });
  return Promise.resolve();
};

export const setLogout = () => dispatch => {
  dispatch({
    type: SET_LOGOUT
  });
};
