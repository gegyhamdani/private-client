import axiosInstance from "./axiosInstance";

const saveFieldstaff = (
  name,
  date,
  alamat,
  phoneNumber,
  username,
  password,
  level,
  idKantah
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.fieldstaff(), {
        name,
        date_born: date,
        alamat,
        phone_number: phoneNumber,
        username,
        password,
        level,
        id_kantah: idKantah
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getAllFieldstaff = () => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.fieldstaff())
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getFieldstaff = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.fieldstaff(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getFieldstaffKantah = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.fieldstaffKantah(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const updateFieldstaff = (
  id,
  name,
  alamat,
  phoneNumber,
  username,
  password
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.fieldstaff(id), {
        name,
        alamat,
        phone_number: phoneNumber,
        username,
        password
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default {
  saveFieldstaff,
  getAllFieldstaff,
  getFieldstaff,
  getFieldstaffKantah,
  updateFieldstaff
};
