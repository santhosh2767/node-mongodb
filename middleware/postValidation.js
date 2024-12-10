const Joi = require('joi');
const { sendErrorResponse } = require("../utils/utils");
const {STATUS_CODE } = require('../constants/constants.js');



const postValidate = (req, res, next) => {
    const schema = Joi.object({
        content: Joi.string().pattern(/^[a-zA-Z0-9\s]*$/)
            .max(250).required().messages({
                'string.pattern.base': 'Special characters are not allowed',
                'string.max': 'Post over 250 characters are not allowed',
                'string.empty': 'post cannot be empty',
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        const errors = error.details[0].message
        return sendErrorResponse(res, errors.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
    next();
};

module.exports = postValidate;
