import axiosInstance from "./axiosInstance";

const getImage = id => {
  const { getInstance, routes } = axiosInstance;
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.image(id))
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

export default { getImage };
