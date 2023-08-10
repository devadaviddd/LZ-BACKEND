export const isName = (name) => {
  return /^[a-zA-Z ]{1,20}$/.test(name);
}