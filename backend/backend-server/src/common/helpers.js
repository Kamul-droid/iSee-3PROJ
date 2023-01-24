import bcrypt from 'bcrypt';

export const hash = (str, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      callback(err, null);
    }
    else {
      bcrypt.hash(str, salt, (err, hash) => {
        callback(err, hash);
      });
    }
  })
}

export const intersection = (o1, o2) => {
  const newObj = {};

  Object.keys(o1).forEach(key => {
    if (Object.keys(o2).includes(key)) {
      newObj[key] = o1[key];
    }
  });

  return newObj;
}