import { ERoles } from '../common/enums.js';
import RolesMW from '../common/middlewares/role.middleware.js';
import ValidationMW from '../common/middlewares/validation.middleware.js';
import authMiddleware from '../common/middlewares/auth.middleware.js';
import express from 'express';
import userService from './user.service.js';
import { validateUser } from './user.schema.js';

const router = express.Router();

router.use(authMiddleware);

// Special case: validateIdParam is not declared in the router level because

router.get(
  '/',
  RolesMW.ensureRoles(ERoles.EMPLOYEE, ERoles.ADMIN),
  async (req, res) => {
    const data = await userService.findAll();

    res.status(200).json({ users : data });
  }
)

router.get(
  '/:_id',
  [
    RolesMW.ensureOnlySelf(ERoles.USER),
    ValidationMW.validateIdParam()
  ],
  async (req, res) => {
    const data = await userService.findOne(req.params._id);

    if (data) {
      res.status(200).json(data);
    }
    else {
      res.status(404).send('User not found');
    }
  }
)

router.patch(
  '/:_id',
  [
    ValidationMW.validate(validateUser, true),
    RolesMW.ensureOnlySelf(ERoles.USER, ERoles.EMPLOYEE),
    ValidationMW.validateIdParam()
  ],
  async (req, res) => {
    try {

      if (req.body.role && req.body.role !== req.user.role && req.user.role !== ERoles.ADMIN) {
        res.status(403).send('You may not modify your own role with your current rights');
        return;
      }

      const data = await userService.update({
        ...req.body,
        _id : req.params._id
      });

      if (data) {
        delete data.password;
        res.status(200).json(data);
      }
      else {
        res.status(404).send('User not found');
      }
    }
    catch (err) {
      res.status(400).send(err)
    }

  }
)

router.delete(
  '/:_id',
  [
    RolesMW.ensureOnlySelf(ERoles.USER, ERoles.EMPLOYEE, ERoles.ADMIN),
    ValidationMW.validateIdParam()
  ],
  async (req, res) => {
    if (await userService.delete(req.params._id)){
      res.status(200).send('Removed user ' + req.params._id);
    }
    else {
      res.status(404).send('User ' + req.params._id + ' does not exist');
    }
  }
)

export default router;