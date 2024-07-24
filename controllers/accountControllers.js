const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const User = require('../models/user');


exports.signup = async (req, res) => {
    try {
        const { name, emailId, password } = req.body;
        // console.log(name, emailId, password);

        if (!name || !emailId || !password) {
            return res.status(400).json({ message: 'User name, email id, password should not be empty' });
        }

        const oldUser = await User.findOne({ where: { emailId } });
        if (oldUser) {
            console.log('user already exists');
            return res.status(400).json({ message: 'user already exists' })
        }

        const saltRoutes = 10;
        bcrypt.hash(password, saltRoutes, async (err, hash) => {
            if (err) {
                thrownew.error('error in bcrypt');
            }
            await User.create({ name, emailId, password: hash })
            res.status(200).json({ message: 'user signup sucessfull' });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

function generateToken(id) {
    return jwt.sign({ userId: id }, 'secretKey');
}

exports.login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(400).json({ message: 'Email ID and password must not be empty' });
        }

        const userLogin = await User.findOne({ where: { emailId: emailId } });
        if (!userLogin) {
            return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(password, userLogin.password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Server Error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Email ID and password do not match' });
            }

            const token = generateToken(userLogin.id);
            return res.status(200).json({ message: 'Login successful', token });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};