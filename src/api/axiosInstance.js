import axios from "axios";

const apiUrl = process.env.SERVER_URL;

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
  laporan: (id = "") => (id ? `laporan/${id}` : "laporan"),
  laporanUser: (id = "") => `laporan/user/${id}`,
  location: (id = "") => (id ? `location/${id}` : "location")
};

export default {
  getInstance,
  routes
};
