module.exports = (db, DataTypes) => {
    const ConferenceReviewer = db.define('ConferenceReviewer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        conferenceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'conference_reviewers',
        timestamps: false,
    });

    return ConferenceReviewer;
};
