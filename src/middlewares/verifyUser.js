const { ROLES } = require("../utils/listValues");
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies["access_token"];
    if (!accessToken) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Authentication failed!!!",
            });
        }
        if (!decoded.id) {
            res.status(404).json({
                message: "Not Found",
            });
            return;
        }
        req.user = decoded.id;
        next();
    });
};

module.exports = verifyUser
