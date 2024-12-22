const db = require("../models");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { where, Op } = require("sequelize");
const { ROLES } = require("../utils/listValues");
const salt = bcryptjs.genSaltSync(10);
const hashedPassword = bcryptjs.hashSync('123456', salt);
console.log(hashedPassword)

class AuthController {
    // Signup [POST]
    async signup(req, res) {
        const { email, username, password } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Error while sending data to server",
            });
            return;
        }
        try {

            const existAccount = await db.Account.findOne({
                where: {
                    [Op.or]: [ { username }, { email } ]
                },
            });
            if (existAccount) {
                res.status(409).json({
                    message: "Account is exist",
                });
                return;
            }

            const salt = bcryptjs.genSaltSync(10);
            const hashedPassword = bcryptjs.hashSync(password, salt);

            const newAccount = await db.Account.create({
                email,
                username,
                password: hashedPassword,
                list_role_id: ROLES.ID,
                role_id: ROLES.USER,
            });

            res.status(200).json({
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
                include: [
                    {
                        model: db.ListValues,
                        as: "role",
                        where: {
                            list_id: { [Op.col]: "Account.list_role_id" },
                        },
                    },
                ],
                where: {
                    email: email,
                    role_id: ROLES.USER //only customer
                },
            });

            if (!account) {
                res.status(400).json({
                    message: "Account don't signup!!",
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

            const access_token = jwt.sign({ id: account.id, role: account.role.ele_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id }, process.env.JWT_REFRESH_KEY);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 366 * 24 * 60 * 60 * 1000,
            });

            const role = await db.ListValues.findOne({
                where: {
                    list_id: account.list_role_id,
                    ele_id: account.role_id,
                },
            });

            res.status(200).json({
                role: role.ele_id,
                username: account.username,
                id: account.id,
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
    async refreshToken(req, res) {
        const refresh_token = req.cookies["refresh_token"];
        if (!refresh_token) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, { id }) => {
            const access_token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
        });
        res.status(200).json({
            message: "Refresh",
        });
    }

    // googleAuth [POST]
    async googleAuth(req, res) {
        const { email, username } = req.body;
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
                const salt = bcryptjs.genSaltSync(10);
                const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const newUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
                const hashedPassword = bcryptjs.hashSync(generatePassword, salt);
                account = await db.Account.create({
                    email,
                    username: newUsername,
                    password: hashedPassword,
                    list_role_id: ROLES.ID,
                    role_id: ROLES.USER,
                });
            }

            const access_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id }, process.env.JWT_REFRESH_KEY);

            console.log(access_token, refresh_token);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 366 * 24 * 60 * 60 * 1000,
            });

            const role = await db.ListValues.findOne({
                where: {
                    list_id: account.list_role_id,
                    ele_id: account.role_id,
                },
            });
            console.log(role);
            

            res.status(200).json({
                role: role.ele_id,
                username: account.username,
                id: account.id,
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
        const { email, username } = req.body;
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
                const salt = bcryptjs.genSaltSync(10);
                const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const newUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
                const hashedPassword = bcryptjs.hashSync(generatePassword, salt);
                account = await db.Account.create({
                    email,
                    username: newUsername,
                    password: hashedPassword,
                    list_role_id: ROLES.ID,
                    role_id: ROLES.USER,
                });
            }

            const access_token = jwt.sign({ id: account.id, role: account.role_id }, process.env.JWT_SECRET_KEY);
            const refresh_token = jwt.sign({ id: account.id }, process.env.JWT_REFRESH_KEY);
            console.log(access_token, refresh_token);

            res.cookie("access_token", access_token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });

            const role = await db.ListValues.findOne({
                where: {
                    list_id: account.list_role_id,
                    ele_id: account.role_id,
                },
            });

            res.status(200).json({
                role: role.ele_id,
                username: account.username,
                id: account.id,
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
