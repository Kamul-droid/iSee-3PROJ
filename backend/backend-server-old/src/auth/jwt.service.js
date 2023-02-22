import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'youShouldBeUsingAMoreSecureSecret'

export default {
  sign : (payload) => {
    return jwt.sign(payload, secret, { expiresIn : '1d' });
  },
  verify : (token) => {
    try {
      return jwt.verify(token, secret);
    }
    catch (error) {
      return false;
    }
  }
}