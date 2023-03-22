import { body } from "express-validator";

const signupValidator = () => {
    return [
        body("username")
            .trim()

            .not()
            .isEmpty()
            .withMessage("Username is required")

            .isLength({ min: 3 })
            .withMessage("The username must be at least 3 chars long"),

        body("password")
            .trim()
            .escape()

            .not()
            .isEmpty()
            .withMessage("Password is required")

            .isLength({ min: 6 })
            .withMessage("The password must be at least 6 chars long"),

        body("email", "The email invalid")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Email is required")

            .isEmail()
            .withMessage("Please enter a valid email address")

            .normalizeEmail(),
        body("role").not().isEmpty().withMessage("Role is required"),
    ];
};

const signinValidator = () => {
    return [
        body("username").not().isEmpty().withMessage("Username is required"),

        body("password").not().isEmpty().withMessage("Password is required"),
    ];
};

const refreshValidator = () => {
    return [body("refresh_token").not().isEmpty().withMessage("Refresh token is required").isString()];
};

export { signinValidator, signupValidator, refreshValidator };
