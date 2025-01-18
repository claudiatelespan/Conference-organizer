const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("tehnologiiWeb", "root", "", {
    host:'localhost',
    dialect:'mysql',
    sync:true,
});

module.exports = sequelize;