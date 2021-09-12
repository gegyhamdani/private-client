import axiosInstance from "./axiosInstance";

const saveFieldstaff = (
  name,
  date,
  alamat,
  phoneNumber,
  target,
  username,
  password,
  level,
  idKantah,
  idKanwil
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.fieldstaff(), {
        name,
        date_born: date,
        alamat,
        phone_number: phoneNumber,
        target,
        username,
        password,
        level,
        id_kantah: idKantah,
        id_kanwil: idKanwil
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

const getFieldstaffKanwil = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.fieldstaffKanwil(id))
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
  target,
  username,
  password,
  pemetaan,
  penyuluhan,
  penyusunan,
  pendampingan,
  evaluasi
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.fieldstaff(id), {
        name,
        alamat,
        phone_number: phoneNumber,
        target,
        username,
        password,
        pemetaan,
        penyuluhan,
        penyusunan,
        pendampingan,
        evaluasi
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const deleteFieldstaff = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .delete(routes.fieldstaff(id))
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
  getFieldstaffKanwil,
  updateFieldstaff,
  deleteFieldstaff
};
