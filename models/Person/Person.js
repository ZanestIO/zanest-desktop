const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// PERSON CLASS WITH METHODS
// ==================================================================================
exports.Person = class Person extends Model {

    static async getters() {

    }

    static async setters(args) {

    }

    static async delete(args) {

    }
    static async add(args) {
        const createUser = require('./add')
        return await createUser(args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    }
}


// ==================================================================================
// PERSON DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
exports.userData = {
    attributes: {

        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        socialID: {
            type: DataTypes.STRING,
            // uniqe 
            primeryKey: true,
            allowNull: false
        },

        address: {
            type: DataTypes.STRING,
            // allow null
        },
        sex: {
            type: DataTypes.STRING(7),
            allowNull: false
        },

        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        phoneNumber: {
            type: DataTypes.INTEGER,
            // allow null
        }, 


    },
    options: {
        "modelName": 'Person'
    }
}