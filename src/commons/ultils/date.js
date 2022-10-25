export const getToday = () => {
  const dateObj = new Date();
  const today = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  return today;
};
