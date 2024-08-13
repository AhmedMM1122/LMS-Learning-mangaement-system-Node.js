// ====================  Required Module ====================
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const connection = require('../db/dbconnection');
const util = require("util");
const bcrypt = require("bcrypt");
const authorize = require("../middleware/authorized")
const admin = require("../middleware/admin")
const crypto = require("crypto");

// register 
router.post("/register",
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").isLength({ min: 8, max: 20 }).withMessage("password should be between(8 - 20) character"),
    body("phone").isMobilePhone().withMessage("Please enter valid phone"),
    body("role").isInt().withMessage("Please enter valid number").isLength({max: 1}).withMessage("Please enter ONE num only"),
    body("name")
    .isString()
    .withMessage("Please enter valid number ")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char")

     ,async (req, res) => {
        try {
            //for validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // for exist email
            const query = util.promisify(connection.query).bind(connection);
            const isEmailExist = await query("select * from users where email=?", [req.body.email]);
            if (isEmailExist.length > 0) {
                res.status(400).json({
                    errors: [
                        {
                            "message": "email already exists",
                        },
                    ],

                });
            }
            //for save user
            const userData = {
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                role: req.body.role, 
                name: req.body.name,
                token: crypto.randomBytes(16).toString("hex")
            }
            // insert user to db
            await query("insert into users set ?", userData);
            delete userData.password;
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({ err: err });
             
        }

    });
// login
router.post("/login",
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").isLength({ min: 8, max: 20 }).withMessage("password should be between(8 - 20) character"),
    async (req, res) => {
        try {
            //for validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // for exist email
            const query = util.promisify(connection.query).bind(connection);
            const isEmailExist = await query("select * from users where email=?", [req.body.email]);
            if (isEmailExist.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            "message": "email or password not found!",
                        },
                    ],

                });
            }
            //compare password
            const checkPassword = await bcrypt.compare(req.body.password, isEmailExist[0].password);
            if (checkPassword) {
                await query("UPDATE users SET status = 'active' WHERE id = ?", [isEmailExist[0].id]);
                delete isEmailExist[0].password;
                res.status(200).json(isEmailExist[0]);
            } else {
                res.status(404).json({
                    errors: [
                        {
                            "message": "email or password not found!",
                        },
                    ],

                });
            }

        } catch (err) {
            res.status(500).json({ err: err });

        }

    });
//log out 
router.post("/logout",authorize,
    async (req, res) => {
        try {
            const token = res.locals.user.token;
            const query = util.promisify(connection.query).bind(connection);
            const user = await query("select * from users where token=?", [token]);
            //check if user exist
            if (user.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            "message": "user not found!",
                        },
                    ],

                });
            } else {
                await query("UPDATE users SET status = 'inactive' WHERE id = ?", [user[0].id]);
                res.status(200).json({
                    message: "user logged out successfully"
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });

        }

    });
module.exports = router;