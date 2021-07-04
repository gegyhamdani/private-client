const convertObjectToArray = arr => {
  return Object.keys(arr).map(key => arr[key]);
};

const findValueOnArray = (arr, selectedValue, searchValue) => {
  return arr[arr.findIndex(val => val[selectedValue] === searchValue)];
};

export { convertObjectToArray, findValueOnArray };
