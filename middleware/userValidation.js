const Joi = require('joi');
const {STATUS_CODE } = require("../constants/constants");
const { sendErrorResponse } = require("../utils/utils");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().pattern(/^[a-z]+$/).required().messages({
            'string.empty': 'Username is required.',
            'string.pattern.base': 'UserName Must be in Lowercase'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'email is required.',
            'string.email': 'Enter valid gmail! use @gmail.com'
        }),
        password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/)
            .required().messages({
                'string.empty': 'Password is required.',
                'string.min': 'Should have atleast 8 characters in password',
                'string.max': 'Should Have below 20 characters in password',
                'string.pattern.base':
                    'Must Include One Special Character, One Uppercase and One Number in password'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, error.message, STATUS_CODE.BAD_REQUEST)
    }
    next();
};

module.exports = validateUser;
