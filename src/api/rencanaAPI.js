import axiosInstance from "./axiosInstance";

const saveRencana = (name, date, lokasi, tindak, userId) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.rencana(), {
        fieldstaff_name: name,
        periode: date,
        lokasi,
        tindak_lanjut: tindak,
        id_fieldstaff: userId
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const updateRencana = (id, date, lokasi, tindak) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.rencana(id), {
        date,
        lokasi,
        tindak_lanjut: tindak
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getRencana = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.rencana(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getUserRencana = userId => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.laporanUser(userId))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const deleteRencana = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .delete(routes.rencana(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default {
  saveRencana,
  updateRencana,
  getRencana,
  getUserRencana,
  deleteRencana
};
