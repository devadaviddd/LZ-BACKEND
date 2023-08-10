export const isPassword = (password) => {
  return /^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);
}
