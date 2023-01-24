import express from 'express';
import bcrypt from 'bcrypt';
import userService from '../users/user.service.js';
import jwtService from './jwt.service.js'
import ValidationMW from '../common/middlewares/validation.middleware.js';
import { validateUser } from '../users/user.schema.js';

const router = express.Router();

router.post(
  '/register',
  ValidationMW.validate(validateUser),
  async (req, res) => {
    try {
      const data = await userService.create(req.body);

      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).send(err);
    }
  })

router.post('/login', async (req, res) => {
  const data = await userService.findByEmail(req.body.email);

  if (data) {
    bcrypt.compare(req.body.password, data.password, (err, same) => {
      if (same) {
        const jwt = jwtService.sign({ _id : data._id });

        res.status(200).json({ jwt });
      }
      else {
        res.status(401).send('Invalid password');
      }
    })
  }
  else {
    res.status(404).send('User not found')
  }
})

export default router;