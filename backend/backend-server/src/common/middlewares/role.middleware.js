class RolesMW {
  // Ensures that only the specified roles are allowed to access the endpoint.
  static ensureRoles(...roles) {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      }
      else {
        res.status(403).send('This operation is not permitted');
      }
    }
  }

  // When the '_id' url parameter is specified, ensures that a given role can only reference itself.
  static ensureOnlySelf(...roles) {
    return (req, res, next) => {
      if (req.params._id === undefined) {
        next();
        return;
      }

      if (req.params._id === 'me') {
        req.params._id = req.user._id;
      }

      if (roles.includes(req.user.role)) {
        if (req.params._id === req.user._id) {
          next();
        }
        else {
          res.status(403).send('This action can only be performed on yourself');
        }
      }
      else {
        next();
      }
    }
  }
}

export default RolesMW;