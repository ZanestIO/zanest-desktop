const {DataTypes, Model} = require('sequelize')
module.exports = {
    attributes: {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        birthDate: {
            type: DataTypes.DATEONLY
            // allowNull is true by defualt
        },

        phoneNumber: {
            type: DataTypes.INTEGER,
        }
    },
    options: {
        "modelName": 'User'
    }
}