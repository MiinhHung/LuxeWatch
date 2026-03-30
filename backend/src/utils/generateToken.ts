import jwt from 'jsonwebtoken';

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};
