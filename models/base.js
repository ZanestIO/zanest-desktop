const {Sequelize, Model} = require('sequelize')
const user = require('./User/user')
const bcrypt = require('bcrypt')
let sequelize;

class User extends Model {}

// ================================================================================
// creates the database connection and admin user
// ================================================================================
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

    // TODO: User add User function for create Admin user
    let adminUser;
    try {
        await sequelize.sync()

        // =======================================
        // creating admin user
        adminUser = await User.findOne({
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

        return [true, sequelize]
        // =======================================
    } catch (err) {
        return [false, err.message]
    }
}

// connect to database
function connectToDb() {
    return new Sequelize({
        dialect: "sqlite",
        storage: "./zanest.sqlite"
    })
}

// add acount info to database 
// for create account of main user of application we need three argument
// include username, password, usertype and another info most be having default
// value. 
