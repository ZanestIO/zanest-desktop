const bcrypt = require('bcrypt');
const Model = require('sequelize');
const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// creates the New User
// ================================================================================
/**
 * creates a new user with given args
 * and add it to DB
 * @param fullname
 * @param username
 * @param password
 * @param usertype
 * @param birthdate
 * @param phonenumber
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (fullname=null, username, password, usertype='staff', birthdate=null, phonenumber=null) => {
    let newUser
    try {
        // check if user exists
        newUser = await db().sequelize.models.User.findOne({
            where: {
                userName: username
            }
        })

        if (newUser === null) {
            bcrypt.hash(password, 10, async (err, hash) => {
                await db().sequelize.models.User.create({fullName: fullname , userName: username , password: hash, userType: usertype,
                    birthDate: birthdate, phoneNumber: phonenumber });
            })

            const msg = message.successUserCretion(username)
            log.record('info', msg)

            return [true, msg]

        } else {
            const msg = message.userNameExist(username)
            log.record('error', msg)
            return [false, msg]

        }

    } catch (err) {
        log.record('error', exception +":"+ __filename + ":" + err)
        return [false, err]
    }
}
