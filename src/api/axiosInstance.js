import axios from "axios";

const apiUrl = "https://agraria-api.herokuapp.com";

const errorResponseHandler = error => {
  return Promise.reject(error);
};

const getInstance = () => {
  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 20000
  });

  instance.interceptors.response.use(
    response => response,
    errorResponseHandler
  );
  return instance;
};

const routes = {
  kanwil: (id = "") => (id ? `kanwil/${id}` : "kanwil"),
  kantah: (id = "") => (id ? `kantah/${id}` : "kantah"),
  fieldstaff: (id = "") => (id ? `fieldstaff/${id}` : "fieldstaff"),
  fieldstaffKantah: (id = "") => `/fieldstaff/kantah/${id}`,
  fieldstaffKanwil: (id = "") => `/fieldstaff/kanwil/${id}`,
  laporan: (id = "") => (id ? `laporan/${id}` : "laporan"),
  laporanUser: (id = "") => `laporan/user/${id}`,
  location: (id = "") => (id ? `location/${id}` : "location"),
  image: (id = "") => (id ? `image/${id}` : "image"),
  rencana: (id = "") => (id ? `rencana/${id}` : "rencana")
};

export default {
  getInstance,
  routes,
  apiUrl
};
