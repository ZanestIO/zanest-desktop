const {DataTypes, Model} = require('sequelize')
const bcrypt = require('bcrypt')

// ==================================================================================
// USER CLASS WITH METHODS
// ==================================================================================
exports.User = class User extends Model {
    /**
     * create default user admin in DB
     * @returns {Promise<void>}
     */
    static async createDefaultAdmin() {
        let adminUser = await User.findOne({
            where: {
                userName: 'admin'
            }
        })
        if (adminUser === null) {
            let hashedPass = '323da#(df$#fald50..'
            bcrypt.hash(hashedPass, 10, async (err, hash) => {
                await User.create({fullName: 'zanest admin', userName: 'admin', password: hash, userType: 'admin'});
            })
        }
    }

    /**
     * login with correct username and password
     * @param username
     * @param password
     * @returns {Promise<[boolean, {fullName: *, id: *, userType: string|*, userName: string|*}]|[boolean, {password: string}]|[boolean, {userName: string}]>}
     */
    static async login(username, password) {

        const UserAuthenticator = require("./userAuth");
        return await UserAuthenticator.login(username, password)
    }

    /**
     * check if the given userType
     * exist in the DB
     * @param type
     * @returns {Promise<boolean>}
     */
    static async userTypeExists(type) {

        const UserAuthenticator = require("./userAuth");
        return await UserAuthenticator.userTypeExists(type)
    }

    /**
     * add new user to DB
     * @param args
     * @returns {Promise<*>}
     */
    static async add(args) {
        const createUser = require('./add')
        return await createUser(args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    }

    // delete User
    /**
     * delete User from DB 
     * @param String (username)
     * @returns {Array<2>} [boolean, message]
     */
    static async delete(args) {
        const deleteUsr = require('./delete')
        return await deleteUsr(args.userName)
    }

    // show User
    /**
     * show User info
     * @param String (username)
     * @returns {Array<2>} [boolean, message]
     */
    static async show(args) {
        const showUsr = require('./show')
        return await showUsr(args.id)
    }

    // update User
    /**
     * updae User from DB 
     * @param args (id, fullname, username, password, usertype, birthdate, phonenumber)
     * @returns {Array<2>} [boolean, message]
     */
    static async update(args) {
        const updateUsr = require('./update')
        return await updateUsr(args.id ,args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    }
    // get user info
    /**
     * 
     * @param {integer} limit 
     * @param {integer} offset 
     * @returns 
     */
    static async getUsers(username) {
        const getter = require('./get')
        return await getter(username)
    }
}


// ==================================================================================
// USER DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define user's attributes
 * @type {{options: {modelName: string}, attributes: {password: {allowNull: boolean, type: *}, phoneNumber: {type: *}, fullName: {type: *}, userType: {default: string, allowNull: boolean, type: *}, userName: {allowNull: boolean, type: *}, birthDate: {type: *}}}}
 */
exports.userData = {
    attributes: {
        fullName: {
            type: DataTypes.STRING,
            // allowNull is true by default
        },

        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        userType: {
            type: DataTypes.STRING,
            allowNull: false,
            default: 'staff'
        },

        birthDate: {
            type: DataTypes.STRING(12),
            // allowNull is true by defualt
        },

        phoneNumber: {
            type: DataTypes.STRING,
        }
    },
    options: {
        "modelName": 'User'
    }
}