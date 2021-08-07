const menu = [
  {
    key: 1,
    title: "Dashboard",
    page: "dashboard",
    level: ["all"],
    subMenu: []
  },
  {
    key: 2,
    title: "Kantah",
    level: ["kanwil"],
    page: "datakantah",
    subMenu: []
  },
  {
    key: 3,
    title: "Fieldstaff",
    level: ["kanwil", "kantah"],
    page: "datafieldstaff",
    subMenu: []
  },
  {
    key: 4,
    title: "Laporan",
    level: ["all"],
    page: "datalaporan",
    subMenu: []
  },
  {
    key: 5,
    title: "Lokasi",
    level: ["kanwil", "kantah"],
    page: "https://ptm.atrbpn.go.id",
    subMenu: []
  },
  {
    key: 6,
    title: "Peserta Pemberdayaan",
    level: ["all"],
    page: "https://ptm.atrbpn.go.id",
    subMenu: []
  }
];

export default menu;
