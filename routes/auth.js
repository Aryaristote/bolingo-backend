const router = require("express").Router();
const passport = require("passport");
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const CLIENT_URL = "http://localhost:5173/dashboard"

//Redirection if both auth failed 
router.get("/login/success", (req,res) => {
     if(req.user) {
    res.status(200).json({
        success:true,
        message: "successful",
        user: req.user,
        //cookies: req.cookies
    });
 }
});

//Redirection if both auth success 
router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success:false,
        message: "failure",
    });
});

router.get("/logout", (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      console.log("User disconnected")
      res.clearCookie("connect.sid");
      res.redirect("http://localhost:5173/");
  });
});

router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", 
    passport.authenticate("google",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);


//Facebook  Auth
router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);


module.exports = router