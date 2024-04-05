const { body, validationResult } = require('express-validator');

// Define validation rules
const validateIncubator = [
    body('BabyName').notEmpty().withMessage('BabyName is required'),
    body('BabyAge').isInt({ min: 0 }).withMessage('BabyAge must be a positive integer'),
    body('ParentName').notEmpty().withMessage('ParentName is required'),
    body('TimeOfRelease').isISO8601().toDate().withMessage('Invalid TimeOfRelease format'),
    body('Gender').notEmpty().withMessage('Gender is required'),
    body('MedicalCondition').notEmpty().withMessage('MedicalCondition is required'),
    body('PhoneNumber').notEmpty().withMessage('PhoneNumber is required'),
];

// Middleware function to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateIncubator, validate };
