const Joi = require('joi');


const postValidate = (req, res, next) => {
    const schema = Joi.object({
        content: Joi.string().pattern(/^[a-zA-Z0-9\s]*$/).max(250).required().messages({
            'string.pattern.base': 'Special characters are not allowed',
            'string.max': 'Post over 250 characters are not allowed',
            'string.empty': 'post cannot be empty',
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        const errors = error.details[0].message
        return res.status(400).json({ statusCode: 400, data: { Message: errors } });
    }
    next();
};

module.exports = postValidate;
