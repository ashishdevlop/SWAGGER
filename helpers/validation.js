const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").isLength({ min: 6, max: 16 }),
  check("image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("plese upolad an image type PNG,JPG"),
];

exports.loginValidation = [
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is not in length ").isLength({ min: 6 }),
];

exports.forgetValidation = [
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

exports.updateProfileValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];
