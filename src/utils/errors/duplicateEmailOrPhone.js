
export const isEmailOrPhoneExist = (errorMessage) => {
  if (errorMessage.startsWith('E11000')) {
    return true;
  }
}