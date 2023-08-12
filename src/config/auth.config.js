import jwt from 'jsonwebtoken';

export const maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
export const createAccessToken = (idToken) => {
  const {
    _id,
  } = idToken;
  return jwt.sign({ _id }, process.env.SECRET_KEY, {
    expiresIn: maxAge
  });
};