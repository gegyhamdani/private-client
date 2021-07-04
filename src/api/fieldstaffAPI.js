import axiosInstance from "./axiosInstance";

const saveFieldstaff = (
  name,
  date,
  location,
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
        location,
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

const getFieldstaff = () => {
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

export default { saveFieldstaff, getFieldstaff };
