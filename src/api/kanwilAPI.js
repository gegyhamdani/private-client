import axiosInstance from "./axiosInstance";

const saveKanwil = (name, date, location, username, password, level) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.kanwil(), {
        name,
        date_born: date,
        location,
        username,
        password,
        level
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getKanwil = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.kanwil(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getAllKanwil = () => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.kanwil())
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const updateKanwil = (id, name, username, password) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.kanwil(id), {
        name,
        username,
        password
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default { saveKanwil, getKanwil, getAllKanwil, updateKanwil };
