const menu = [
  {
    key: 1,
    title: "Beranda",
    page: "dashboard",
    level: ["all"],
    subMenu: []
  },
  {
    key: 2,
    title: "Data Kantah",
    level: ["kanwil"],
    subMenu: [
      {
        key: "2-1",
        title: "Input Data Kantah",
        page: "inputkantah",
        level: ["kanwil"]
      },
      {
        key: "2-2",
        title: "Lihat Data Kantah",
        page: "datakantah",
        level: ["kanwil"]
      }
    ]
  },
  {
    key: 3,
    title: "Data Fieldstaff",
    level: ["kanwil", "kantah"],
    subMenu: [
      {
        key: "3-1",
        title: "Input Fieldstaff",
        page: "inputfieldstaff",
        level: ["kantah"]
      },
      {
        key: "3-2",
        title: "Lihat Fieldstaff",
        page: "datafieldstaff",
        level: ["kanwil", "kantah"]
      }
    ]
  },
  {
    key: 4,
    title: "Data Lokasi",
    level: ["kanwil", "kantah"],
    subMenu: [
      {
        key: "4-1",
        title: "Input Lokasi",
        page: "inputlokasi",
        level: ["kantah"]
      },
      {
        key: "4-2",
        title: "Lihat Lokasi",
        page: "datalokasi",
        level: ["kanwil", "kantah"]
      }
    ]
  },
  {
    key: 5,
    title: "Data Peserta Pemberdayaan",
    level: ["all"],
    subMenu: [
      {
        key: "5-1",
        title: "Input Peserta Pemberdayaan",
        page: "inputpeserta",
        level: ["all"]
      },
      {
        key: "5-2",
        title: "Lihat Peserta Pemberdayaan",
        page: "datapeserta",
        level: ["all"]
      }
    ]
  },
  {
    key: 6,
    title: "Laporan",
    level: ["all"],
    subMenu: [
      {
        key: "6-1",
        title: "Input Laporan",
        page: "inputlaporan",
        level: ["fieldstaff"]
      },
      {
        key: "6-2",
        title: "Lihat Laporan",
        page: "datalaporan",
        level: ["all"]
      },
      {
        key: "6-3",
        title: "Cetak Laporan",
        page: "cetaklaporan",
        level: ["fieldstaff"]
      }
    ]
  }
];

export default menu;
