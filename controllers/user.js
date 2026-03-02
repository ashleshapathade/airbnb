const User=require("../models/user.js");
const passport = require("passport");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { email, username, password, confirmPassword } = req.body;

        // 1️⃣ Password match check
        if (password !== confirmPassword) {
            req.flash("error", "Password and Confirm Password do not match!");
            return res.redirect("/signup");
        }

        // 2️⃣ Email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash("error", "Email already exists!");
            return res.redirect("/signup");
        }

        // 3️⃣ Username already exists  ✅ NEW CONDITION
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            req.flash("error", "Username already exists!");
            return res.redirect("/signup");
        }

        // 4️⃣ Create user
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!!");
  res.redirect("/listings");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out !!");
        res.redirect("/listings");
    }
    );
    

}