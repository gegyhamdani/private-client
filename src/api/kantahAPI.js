import axiosInstance from "./axiosInstance";

const saveKantah = (
  name,
  date,
  location,
  username,
  password,
  level,
  idKanwil
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.kantah(), {
        name,
        date_born: date,
        location,
        username,
        password,
        level,
        id_kanwil: idKanwil
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getKantah = () => {
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

export default { saveKantah, getKantah };
