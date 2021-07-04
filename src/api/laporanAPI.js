import axiosInstance from "./axiosInstance";

const saveLaporan = (
  name,
  date,
  kegiatan,
  keterangan,
  foto,
  lokasi,
  keluhan,
  saran = "",
  userId
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .post(routes.laporan(), {
        fieldstaff_name: name,
        tanggal_laporan: date,
        kegiatan,
        keterangan,
        foto,
        lokasi,
        keluhan,
        saran,
        id_fieldstaff: userId
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getLaporan = () => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.laporan())
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const getUserLaporan = userId => {
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

export default { saveLaporan, getLaporan, getUserLaporan };
