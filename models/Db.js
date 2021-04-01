const {Sequelize, Model} = require('sequelize')
const {User, userData} = require('./User/User')
let database

// ==================================================================================
// SINGLETON CLASS FOR DATABASE
// ==================================================================================
class Db {
    // ==================================================================================
    // constructs the db and logs if there is error
    constructor() {
        try {
            this.sequelize = new Sequelize({
                dialect: "sqlite",
                storage: "./zanest.sqlite"
            })
        } catch (err) {
            let msg = "Database Creation Error =>" + err.message
            // for logging in the console
            console.log(msg)
        }
    }

    // ==================================================================================
    // authenticating the db with logging and info handling
    /**
     * a function to check if the database is connected
     * @returns {Promise<boolean|(boolean|string)[]>}
     */
    async authenticate() {
        // check if db connection is correct
        try {
            await this.sequelize.authenticate();
            return true
        } catch (error) {
            let msg = "Database Authentication Error =>" + error.message

            console.log("Database Authentication Error =>" + error.message)
            return [false, msg]
        }
    }

    // ==================================================================================
    // initializing the database at start of application
    /**
     * initialize the database when the app starts
     * @returns {Promise<boolean>}
     */
    init = async () => {
        let ConnectionValid = this.authenticate();
        if (ConnectionValid) {
            User.init(userData.attributes, {sequelize: this.sequelize, modelName: userData.options.modelName})

            // syncing db
            await this.sequelize.sync()

            // creating default admin if not exists
            await User.createDefaultAdmin()
            return true
        }
    }
}


// ==================================================================================
// WHAT WE ARE USING THROUGHOUT THE APPLICATION
// Database.getDB
/**
 * checks if DB has been created or not
 * @returns {Db|*}
 */
module.exports = function () {
    if (typeof database !== typeof new Db()) {
        database = new Db()
        return database
    } else {
        return database
    }
}