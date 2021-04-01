const bcrypt = require('bcrypt');
const Model = require('sequelize');
const db = require('../Db.js');


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

            // logging and returning
            console.log(`${username} created.`)
            return [true, "نام کاربری با موفقیت ایجاد شد"]

        } else {

            // logging and returning
            console.log(`can't create ${username}`)
            return [false, "نام کاربری در سیستم موجود است"]
        }
        // =======================================
    } catch (err) {

        console.log(err.msg)
        return [false, err.msg]
    }
}
