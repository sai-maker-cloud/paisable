const { body, validationResult } = require('express-validator');

const validateRegistration = [
  // Validate email
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.'),

  // Validate password
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters long.')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/)
    .withMessage('Password must contain at least one alphabet, one digit, and one symbol.'),

  // Middleware to handle the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
};