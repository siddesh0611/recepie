const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const User = require('./user');

const Follow = sequelize.define('Follow', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    followedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

User.belongsToMany(User, {
    through: Follow,
    as: 'Followers',
    foreignKey: 'followedId',
    otherKey: 'followerId'
});

User.belongsToMany(User, {
    through: Follow,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followedId'
});


module.exports = Follow;
