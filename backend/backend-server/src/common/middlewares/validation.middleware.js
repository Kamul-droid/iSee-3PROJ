import mongoose from "mongoose";

class ValidationMW {
  static validate(validator, partial = false) {
    return (req, res, next) => {
      const { error } = validator(req.body, partial);

      if (error) {
        res.status(400).send(error.details.map(o => o.message));
      }
      else {
        next();
      }
    }
  }

  static validateIdParam() {
    return (req, res, next) => {
      if (mongoose.isValidObjectId(req.params._id)) {
        next();
      }
      else {
        res.status(400).send('Invalid objectId in parameter field')
      }
    }
  }

  static validatePagination() {
    return (req, res, next) => {
      const {
        pageSize, page
      } = req.query

      if (pageSize && (isNaN(pageSize) || parseInt(pageSize) < 1)) {
        res.status(400).send('Parameter "pageSize" must be an integer of value >= 1');
        return;
      }
      if (page && (isNaN(page) || parseInt(page) < 1)) {
        res.status(400).send('Parameter "page" must be an integer of value >= 1');
        return;
      }

      req.pagination = {
        page     : parseInt(page) || 1,
        pageSize : parseInt(pageSize) || 10
      }

      next();
    }
  }

  static validateSorting() {
    return (req, res, next) => {
      const sort = req.query.sort
      const sortObject = {}

      if (sort) {

        sort.split(' ').forEach(sortElement => {
          // Desc sort: start with '-' before property name
          if (sortElement[0] == '-') {
            sortObject[sortElement.substr(1)] = -1;
          }
          // Ascending sort: no prefix
          else {
            sortObject[sortElement] = 1;
          }
        });
      }

      req.sort = sortObject;

      next();
    }
  }
}

export default ValidationMW;