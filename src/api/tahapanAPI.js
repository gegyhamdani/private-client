import axiosInstance from "./axiosInstance";

const saveTahapan = (
  name,
  pemetaan,
  penyuluhan,
  penyusunan,
  pendampingan,
  evaluasi,
  userId
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.tahapan(), {
        fieldstaff_name: name,
        pemetaan,
        penyuluhan,
        penyusunan,
        pendampingan,
        evaluasi,
        id_fieldstaff: userId
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const updateTahapan = (
  id,
  pemetaan,
  penyuluhan,
  penyusunan,
  pendampingan,
  evaluasi
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.tahapan(id), {
        pemetaan,
        penyuluhan,
        penyusunan,
        pendampingan,
        evaluasi
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getTahapan = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.tahapan(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getUserTahapan = userId => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.tahapanUser(userId))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const deleteTahapan = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .delete(routes.tahapan(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default {
  saveTahapan,
  updateTahapan,
  getTahapan,
  getUserTahapan,
  deleteTahapan
};
