//user model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
     
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
     
        role:{
            type: DataTypes.STRING,
            defaultValue:"user"
        }
    }, {timestamps: true}, )
    return User
 }