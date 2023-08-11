export const isPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[!@#$%^&*?]).{6,16}$/.test(password);
}
