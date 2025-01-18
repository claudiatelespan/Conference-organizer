module.exports = (db, DataTypes) => {
    const ArticleModel = db.define("articles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        conferenceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        authorId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('submitted', 'reviewed', 'accepted', 'rejected'),
            defaultValue: 'submitted',
          },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false
          }
    })
    return ArticleModel;
}