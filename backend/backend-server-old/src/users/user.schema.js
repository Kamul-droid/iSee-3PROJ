import Joi from 'joi'
import { intersection, hash } from '../common/helpers.js';
import { ERoles } from '../common/enums.js';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email : {
      type   : String,
      unique : true
    },
    username : { type : String },
    password : { type : String },
    role     : { type : String },
  },
  { timestamps : true }
);

UserSchema.pre('save', function(next) {
  hash(this.password, (err, hash) => {
    if (err) {
      next(err);
    }
    else {
      this.password = hash;
      next();
    }
  })
})

UserSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();

  if (update?.password){
    hash(update.password, (err, hash) => {
      if (err) {
        next(err);
      }
      else {
        update.password = hash;
        next();
      }
    })
  }
  else {
    next()
  }
})

const User = mongoose.model('User', UserSchema);

const validateUser = (user, partial) => {
  let schema = ({
    email    : Joi.string().email().required(),
    username : Joi.string().alphanum().min(4).max(64).required(),
    password : Joi.string().min(8)
      .regex(/(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/)
      .messages({
        'string.pattern.base' : 'Your password needs at least \
one lowercase, uppercase, number and special character'
      })
      .required(),
    role : Joi.string().valid(...Object.keys(ERoles)).required()
  })

  if (partial) {
    schema = intersection(schema, user);
  }

  return Joi.object(schema).validate(user, { abortEarly : false });
}

export {
  User,
  validateUser
};