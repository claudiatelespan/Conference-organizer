module.exports = (db, DataTypes) => {
    const Conference = db.define('Conference', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      organizer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'conferences',
      timestamps: false,
    });
  
    return Conference;
  };
  