import axiosInstance from "./axiosInstance";

const saveLaporan = (desa, kecamatan, kota, provinsi) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.kanwil(), {
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

export default { saveLaporan };
