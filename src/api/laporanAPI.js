import axiosInstance from "./axiosInstance";

const saveLaporan = (
  name,
  date,
  kegiatan,
  penyuluhan,
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
        penyuluhan,
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

const updateLaporan = (
  id,
  kegiatan,
  keterangan,
  foto,
  lokasi,
  keluhan,
  saran = ""
) => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .put(routes.laporan(id), {
        kegiatan,
        keterangan,
        foto,
        lokasi,
        keluhan,
        saran
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const getLaporan = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.laporan(id))
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

export default { saveLaporan, updateLaporan, getLaporan, getUserLaporan };
