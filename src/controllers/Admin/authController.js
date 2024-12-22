const db = require('../../models')
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { where, Op } = require("sequelize");
const { ROLES } = require('../../utils/listValues')

class AuthController {
    // Login [POST]
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Missing field!!!",
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
                    role_id: {
                        [Op.or]: [ROLES.ADMIN, ROLES.S_ADMIN]
                    }
                },
            });


            if (!account) {
                res.status(400).json({
                    message: "Account doesn't exist!!",
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

            res.status(200).json({
                role: account.role.ele_id,
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
}

module.exports = new AuthController();
