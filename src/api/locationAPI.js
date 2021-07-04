import axiosInstance from "./axiosInstance";

const saveLocation = (desa, kecamatan, kota, provinsi) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.location(), {
        desa,
        kecamatan,
        kota,
        provinsi
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getLocation = () => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.location())
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default { saveLocation, getLocation };
