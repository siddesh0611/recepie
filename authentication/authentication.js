const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication token is missing' });
        }

        const decoded = jwt.verify(token, 'secretKey');
        const userId = decoded.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
}

module.exports = authentication;