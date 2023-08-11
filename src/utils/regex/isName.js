export const isName = (name) => {
  return /^[a-zA-Z[0-9]{1,20}$/.test(name);
}