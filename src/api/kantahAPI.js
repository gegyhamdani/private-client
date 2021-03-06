import axiosInstance from "./axiosInstance";

const saveKantah = (
  name,
  username,
  password,
  email,
  head,
  nip,
  level,
  idKanwil
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.kantah(), {
        name,
        username,
        password,
        email,
        head_name: head,
        nip_head_name: nip,
        level,
        id_kanwil: idKanwil
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getKantah = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.kantah(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getAllKantah = () => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.kantah())
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const updateKantah = (id, name, username, password, email, head, nip) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.kantah(id), {
        name,
        username,
        password,
        email,
        head_name: head,
        nip_head_name: nip
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const deleteKantah = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .delete(routes.kantah(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default {
  saveKantah,
  getKantah,
  getAllKantah,
  updateKantah,
  deleteKantah
};
