const User = require("../models/user");

module.exports.signUpUser = async (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.createUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const addUser = new User({ username, email });
    let newUser = await User.register(addUser, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("message", "User register successfully");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/listings");
  }
};

module.exports.loginForm = async (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginAuthentication = async (req, res) => {
  req.flash("success", "Welcome back to Wonderlust");
  let redirectUrl = res.locals.savedRedirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
