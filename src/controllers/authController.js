const db = require("../models");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { where } = require("sequelize");
class AuthController {
    // Signup [POST]
    async signup(req, res) {
        const { email, username, password, role = 1 } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Error while sending data to server",
            });
            return;
        }
        try {
            const existAccount = await db.Account.findOne({
                where: {
                    email: email,
                },
            });
            if (existAccount) {
                res.status(400).json({
                    message: "Account is exist",
                });
                return;
            }
            const newEmployee = await db.Employee.create({});
            const newCustomer = await db.Customer.create({});
            const salt = bcryptjs.genSaltSync(10);
            const hashedPassword = bcryptjs.hashSync(password, salt);

            const newAccount = await db.Account.create({
                email,
                username,
                password: hashedPassword,
                role_id: role,
            });

            res.status(200).json({
                role: newAccount.role_id,
                result: {
                    newEmployee,
                    newCustomer,
                    newAccount,
                },
                message: "Signup successfull",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    // Login [POST]
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Error while sending data to server",
            });
            return;
        }

        try {
            const account = await db.Account.findOne({
                where: {
                    email: email,
                },
            });

            if (!account) {
                res.status(400).json({
                    message: "Username don't exist!!",
                });
                return;
            }
            const validPassword = bcryptjs.compareSync(password, account.password);

            if (!validPassword) {
                res.status(400).json({
                    message: "Password is wrong!!",
                });
                return;
            }

            const access_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_REFRESH_KEY);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                role: account.role_id,
                username: account.username,
                message: "Login successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    // Logout [GET]
    async logout(req, res) {
        try {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(200).json({
                message: "Logout successfully!!",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    // refresh token [POST]
    async refreshToken(req, res) {}

    // googleAuth [POST]
    async googleAuth(req, res) {
        const { email, username, role = 1 } = req.body;
        if (!username || !email) {
            res.status(400).json({
                message: "Error while sending data to server",
            });
            return;
        }
        try {
            let account = await db.Account.findOne({
                where: {
                    email: email,
                },
            });
            if (!account) {
                const newEmployee = await db.Employee.create({});
                const newCustomer = await db.Customer.create({});
                const salt = bcryptjs.genSaltSync(10);
                const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const newUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
                const hashedPassword = bcryptjs.hashSync(generatePassword, salt);
                account = await db.Account.create({
                    email,
                    username: newUsername,
                    password: hashedPassword,
                    cust_id: newCustomer.id,
                    employee_id: newEmployee.id,
                    role_id: role,
                });
            }

            const access_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_REFRESH_KEY);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                role: account.role_id,
                username: account.username,
                message: "Login successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    
    // facebookAuth [POST]
    async facebookAuth(req, res) {
        const { email, username, role = 1 } = req.body;
        if (!username || !email) {
            res.status(400).json({
                message: "Error while sending data to server",
            });
            return;
        }
        try {
            let account = await db.Account.findOne({
                where: {
                    email: email,
                },
            });
            if (!account) {
                const newEmployee = await db.Employee.create({});
                const newCustomer = await db.Customer.create({});
                const salt = bcryptjs.genSaltSync(10);
                const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const newUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
                const hashedPassword = bcryptjs.hashSync(generatePassword, salt);
                account = await db.Account.create({
                    email,
                    username: newUsername,
                    password: hashedPassword,
                    cust_id: newCustomer.id,
                    employee_id: newEmployee.id,
                    role_id: role,
                });
            }

            const access_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_REFRESH_KEY);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                role: account.role_id,
                username: account.username,
                message: "Login successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController();
