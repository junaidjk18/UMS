const { body, validationResult } = require('express-validator');


// Middleware for validating input
const validateInput = [
    body('name').trim().isLength({min:3}).withMessage('Name must be 3 or more characters'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').trim().isLength({min:3}).withMessage('Password must be 3 or more characters'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const errorArray = errors.array().map(error => error.msg);
          return res.render('registration',{error: errorArray});
      }
      next();
    }
  ];

  const validateNewUser = [
    body('name').trim().isLength({min:3}).withMessage('Name must be 3 or more characters'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').trim().isLength({min:3}).withMessage('Password must be 3 or more characters'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const errorArray = errors.array().map(error => error.msg);
          return res.render('new-user',{error: errorArray});
      }
      next();
    }
  ];

  module.exports = {validateInput,validateNewUser}