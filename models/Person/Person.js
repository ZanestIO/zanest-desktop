const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// PERSON CLASS WITH METHODS
// ==================================================================================
exports.Person = class Person extends Model {

    /**
     * getter function to get args(attributes)
     * @returns {Promise<void>}
     */
    static async getters() {

    }

    /**
     * setter function to set args(attributes)
     * @param args (attributes)
     * @returns {Promise<void>}
     */
    static async setters(args) {

    }

    /**
     * delete person object from DB
     * @param args (attributes)
     * @returns {Promise<void>}
     */
    static async delete(args) {

    }

    /**
     * add person object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const createUser = require('./add')
        return await createUser(args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    }
}


// ==================================================================================
// PERSON DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define person's attributes
 * @type {{options: {modelName: string}, attributes: {address: {type: *}, phoneNumber: {type: *}, socialID: {allowNull: boolean, type: *, primeryKey: boolean}, sex: {allowNull: boolean, type: *}, fullName: {allowNull: boolean, type: *}, birthDate: {allowNull: boolean, type: *}}}}
 */
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
            type: DataTypes.STRING(12),
            allowNull: false,
        },

        phoneNumber: {
            type: DataTypes.STRING(11),
            // allow null
        }, 


    },
    options: {
        "modelName": 'Person'
    }
}