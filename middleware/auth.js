const jwt = require('jsonwebtoken');

const authentication = function (req, res, next) {
    let signedToken = req.header('Authorization');
    if (!signedToken) {
        return res.status(401).send("Access denied.");
    }
    try {
        const decoded = jwt.verify(signedToken, process.env.SECRET);
        req.signedToken = signedToken;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

}

module.exports = authentication;