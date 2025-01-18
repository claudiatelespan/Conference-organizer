module.exports = (db, DataTypes) => {
    const ConferenceAuthor = db.define('ConferenceAuthor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        conferenceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'conference_authors',
        timestamps: false,
    });

    return ConferenceAuthor;
};
