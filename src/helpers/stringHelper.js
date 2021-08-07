/* eslint-disable import/prefer-default-export */
const urlHttpNormalizer = url => {
  const prefixes = /^((http|https|ftp):\/\/)/;

  if (prefixes.test(url)) {
    return true;
  }

  return false;
};

export { urlHttpNormalizer };
