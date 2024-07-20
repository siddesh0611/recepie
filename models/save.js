const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Save = sequelize.define('Save', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    collection: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Save;