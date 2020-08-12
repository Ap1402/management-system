const { roles } = require("../roles");
const ErrorHandler = require("../helpers/ErrorHandler");

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw Error("Seems you are not logged in or this user does not exists");
      }
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        next(
          new ErrorHandler(
            "403",
            "You do not have enough permissions to do that"
          )
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
