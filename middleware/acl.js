const { roles } = require("../roles");

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      if(!req.user){
        throw Error('Seems you are not logged in or this user does not exists')
      }
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
