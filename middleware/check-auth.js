const jwt = require("jsonwebtoken");

module.exports = (req, resp, next) => {
    try {
        const authType = req.headers.authorization.split(" ")[0];
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret_passspharse");
        next();
    } catch (error) {
        console.log(error);
        resp.status(401).json({ message: "Auth failed: " + error })
    }

}