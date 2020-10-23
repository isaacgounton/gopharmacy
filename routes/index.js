var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword
    });
    try {
        User.create(newUser, function(err, user){
            if(err){
                req.flash("error", err.message);
                return res.render("register");
            } else if(newUser.password !== newUser.cpassword){
                req.flash("error", "Passwords do not match");
                return res.render("register");
            }
            passport.authenticate("local", {
                successRedirect: "/login",
                failureRedirect: "/register"
            });
        });
    } catch (error) {
       console.log(error.stack); 
    }
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/products",
        failureRedirect: "/login"
    })
);

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("./products");
});



module.exports = router;