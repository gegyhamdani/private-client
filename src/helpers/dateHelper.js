import { monthNames } from "../constant/date";

const convertDate = value => {
  const date = new Date(value);
  const dateDay =
    date.getDate().toString().length < 2
      ? `0${date.getDate()}`
      : date.getDate();
  const dateMonth = monthNames[date.getMonth()];

  return `${dateDay} ${dateMonth} ${date.getFullYear()}`;
};

export default { convertDate };
