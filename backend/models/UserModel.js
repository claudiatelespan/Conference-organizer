
module.exports = (db, DataTypes) => {
    const User = db.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM('organizer', 'reviewer', 'author'),
            allowNull:false
        }
        
    },{
        timestamps: false, 
    }

);

    return User;
}