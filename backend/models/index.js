const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');
const userModel = require('./UserModel');
const conferenceModel = require('./ConferenceModel')
const conferenceReviewerModel = require('./ConferenceReviewerModel')
const conferenceAuthorModel = require('./ConferenceAuthorModel');
const articleModel = require('./ArticleModel');
const articleReviewerModel = require('./ArticleReviewerModel');


const conferenceAuthor = conferenceAuthorModel(db, DataTypes);
const conferenceReviewers = conferenceReviewerModel(db, DataTypes);
const conference = conferenceModel(db, DataTypes);
const user = userModel(db, DataTypes);
const article = articleModel(db, DataTypes);
const articleReviewer = articleReviewerModel(db, DataTypes);


user.hasMany(conference, {
    foreignKey: 'organizer_id',
     as: 'organizedConferences'
});

conference.belongsTo(user, {
    foreignKey:'organizer_id'
})
conference.hasMany(article, {
    foreignKey: 'conferenceId',
    as: 'organizer'
});

article.belongsTo(conference, {
    foreignKey:'conferenceId'
});

user.hasMany(article, {
    foreignKey:'authorId'
});

article.belongsTo(user, {
    foreignKey:'authorId'
});

article.belongsToMany(user, {
    through: articleReviewer,
    foreignKey: 'article_id'
});

user.belongsToMany(article, {
    through: articleReviewer,
    foreignKey: 'reviewer_id'
})

conference.belongsToMany(user, {
    through: conferenceAuthor,
    foreignKey: 'conferenceId',
});

user.belongsToMany(conference, {
    through: conferenceAuthor,
    as: 'Conferences',
    foreignKey:'authorId'
});

conference.belongsToMany(user, {
    through: conferenceReviewers,
    as: 'reviewers',
    foreignKey: 'conferenceId'
});

user.belongsToMany(conference, {
    through: conferenceReviewers,
    as: 'conferences-reviewers',
    foreignKey: 'reviewerId'
});

conference.hasMany(conferenceReviewers, {
    foreignKey: 'conferenceId',
    as: 'conferenceReviewers', 
});

conferenceReviewers.belongsTo(conference, {
    foreignKey: 'conferenceId',
    as: 'conference',
});

module.exports = {
    connection: db,
    user,
    conference,
    conferenceReviewers,
    conferenceAuthor, 
    article,
    articleReviewer
}