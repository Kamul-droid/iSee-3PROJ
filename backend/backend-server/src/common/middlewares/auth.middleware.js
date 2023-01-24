import jwtService from '../../auth/jwt.service.js'
import userService from '../../users/user.service.js';

export default async (req, res, next) => {
  const jwt = req.get('Authorization');

  if (jwt) {
    const token = jwt.split(' ')[1];

    if (token) {
      const user = jwtService.verify(token);
      const userUpdated = await userService.findOne(user._id);

      if (userUpdated) {
        user.role = userUpdated.role;
      }
      // Case where the previous request was a delete on self
      else {
        res.status(401).send('Your session has been invalidated, this may be due to you having deleted your account');
      }

      if (user) {
        req.user = user;
        next();
        return;
      }
    }
    res.status(401).send('Invalid jwt, please try to log in again');
  }
  else {
    res.status(401).send('Please login to access this resource');
  }
}