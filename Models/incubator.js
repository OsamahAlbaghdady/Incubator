// incubator model
module.exports = (sequelize, DataTypes) => {
    const Incubator = sequelize.define("incubator", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DeviceId : {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'deviceId'
        },
        BabyName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'babyName'
        },
        BabyAge: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'babyAge'
        },
        ParentName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'parentName'
        },
        TimeOfRelease: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'timeOfRelease'
        },
        Gender: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'gender'
        },
        MedicalCondition: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'medicalCondition'
        },
        // add icubator id 
        PhoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'phoneNum'
        },
        // userId
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'userId'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, { 
        timestamps: true,
        tableName: 'incubators'
    });

    Incubator.associate = (models) => {
        Incubator.belongsTo(models.User, {
            foreignKey: 'userId',
            allowNull: true
        });
    };

    return Incubator;
}
