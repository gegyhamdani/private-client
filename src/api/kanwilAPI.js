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

const getKanwil = () => {
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

export default { saveKanwil, getKanwil };
