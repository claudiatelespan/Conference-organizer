const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("tehnologiiWeb", "root", "", {
    host:'localhost',
    dialect:'mysql',
    sync:true,
});

module.exports = sequelize;


// reviewer sa si vada doar la ce e alocat 
// toate articolele unei conferinte 
// update are dreptul sa schime file path atat
// trb resetat si statusul din artcile reviewer 
// autorul sa si vada doar conferintele lor
