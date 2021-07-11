import { ACTION_TYPES_AUTH } from "../types";

const initialState = {
  isLogin: false,
  token: "",
  isAuthenticating: false,
  level: "",
  username: "",
  userId: ""
};

const auth = (state = initialState, action) => {
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
  const {
    type,
    isLogin,
    token,
    isAuthentication,
    level,
    username,
    name,
    userId
  } = action;

  const setLogin = () => {
    return {
      ...state,
      isLogin
    };
  };

  const setToken = () => {
    return {
      ...state,
      token
    };
  };

  const setAuthentication = () => {
    return {
      ...state,
      isAuthentication
    };
  };

  const setLevel = () => {
    return {
      ...state,
      level
    };
  };

  const setUsername = () => {
    return {
      ...state,
      username
    };
  };

  const setUserId = () => {
    return {
      ...state,
      userId
    };
  };

  const setName = () => {
    return {
      ...state,
      name
    };
  };

  const setLogout = () => {
    return {
      isLogin: false,
      token: "",
      isAuthenticating: false,
      level: "",
      username: "",
      userId: "",
      name: ""
    };
  };

  switch (type) {
    case SET_IS_LOGIN:
      return setLogin();
    case SET_TOKEN:
      return setToken();
    case SET_IS_AUTHENTICATING:
      return setAuthentication();
    case SET_LEVEL:
      return setLevel();
    case SET_USERNAME:
      return setUsername();
    case SET_USER_ID:
      return setUserId();
    case SET_LOGOUT:
      return setLogout();
    case SET_NAME:
      return setName();
    default:
      return state;
  }
};

export default auth;
