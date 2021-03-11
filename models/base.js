const {Sequelize, Model} = require('sequelize')
const user = require('./user')
let sequelize;
class User extends Model {}

// creates the database and tables
exports.dbInit = async () => {
    // create db connection
    try {
        sequelize = connectToDb()
    } catch (err) {
        let msg = "Database Creation Error =>" + err.message
        return [false, msg]
    }


    // check if db connection is correct
    let validConn = false
    try {
        await sequelize.authenticate();
        validConn = true
    } catch (error) {
        let msg = "Database Authentication Error =>" + error.message
        return [false, msg]
    }

    if (validConn) {
        User.init(user.attributes, {sequelize, modelName: user.options.modelName})
    }
    // initializing all of the database tables

    try {
        await sequelize.sync()
        return [true, sequelize]
    }
    catch(err)  {
        return [false, sequelize]
    }

}

function connectToDb() {
    return new Sequelize({
        dialect: "sqlite",
        storage: "./zanest.sqlite"
    })

}