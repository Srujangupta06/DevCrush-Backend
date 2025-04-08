const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is Required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is Invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Your Password must be Strong");
  }
};

const validateMyProfileEditData = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "bio",
    "skills",
    "avatar",
  ];
  const data = req.body;
  const isEditAllowed = Object.keys(data).every((key) =>
    ALLOWED_EDIT_FIELDS.includes(key)
  );
  return isEditAllowed;
};
module.exports = { validateSignUp, validateMyProfileEditData };
