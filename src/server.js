const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connectDB");
const route = require("./routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 6969;

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

connectDB();

route(app);
app.get("/status", (req, res) => {
    res.json({
        message: "successfull",
    });
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
