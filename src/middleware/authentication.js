const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(400).json({data: null, message: `Invalid header format`});
        }
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({data: null, message: `Invalid header format`});
        }
        const {_id} = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id, "logins.token": token});
        if (!user) {
            return res.status(403).json({message: `Session expired. Please login again`});
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: e.message});
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({data: null, message: `${req.user.role} is not authorized to access this route`});
    }
}

module.exports = {auth, authorize};