const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const AuthController = require("../../controllers/AuthController");

//@route Post /auth/
//@desc User login route
//@access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password").notEmpty()
  ],
  AuthController.loginUser
);


router.get(
  "/test",auth, async(req, res)=>{
    try{
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user)
      
    }catch(err){
      console.log(err);
      res.status(500).send();
    }

  }
  );

router.post("/logout/me", auth, AuthController.logoutActualToken);

router.post("/logout/all", auth, AuthController.logoutAllTokens);

module.exports = router;
