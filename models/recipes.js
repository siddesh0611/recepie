const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Recipes = sequelize.define('Recipes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cuisine: {
        type: Sequelize.STRING,
    },
    veg: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    recipesType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    recipesName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imgUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ingredients: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    method: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cookingTime: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Recipes;