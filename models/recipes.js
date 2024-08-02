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
        get() {
            return this.getDataValue('ingredients') ? this.getDataValue('ingredients').split(';') : [];
        },
        set(value) {
            this.setDataValue('ingredients', Array.isArray(value) ? value.join(';') : value);
        }
    },
    method: {
        type: Sequelize.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('method') ? this.getDataValue('method').split(';') : [];
        },
        set(value) {
            this.setDataValue('method', Array.isArray(value) ? value.join(';') : value);
        }
    },
    cookingTime: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Recipes;