
export const isCategoryNameExist = (errorMessage) => {
  if (errorMessage.startsWith('E11000')) {
    return true;
  }
}