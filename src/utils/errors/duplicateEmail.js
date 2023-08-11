
export const isEmailExist = (errorMessage) => {
  if (errorMessage.startsWith('E11000')) {
    return true;
  }
}