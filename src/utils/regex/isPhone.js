export const isPhone = (phone) => {
  return /^[0-9]{0,15}$/.test(phone);
};
