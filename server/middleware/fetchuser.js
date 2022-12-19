const jwt = require("jsonwebtoken");
const JWT_SECRET = "Tusharisgood@boy";

const fetchuser = (req, res, next) => {
    // get user from the jwt token and id to req obj
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'acces denied' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send({ error: 'acces denied' })
    }

}

module.exports = fetchuser;