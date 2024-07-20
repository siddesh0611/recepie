
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Rating = sequelize.define('Rating', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
});

module.exports = Rating;

