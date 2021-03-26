const bcrypt = require('bcrypt')
const Model = require('sequelize');
const { dbInit } = require('../base');

class User extends Model {}

// ================================================================================
// creates the New User
// ================================================================================
module.exports = async (fullname=null, username, password, usertype='staff', birthdate=null, phonenumber=null) => {
    let newUser = new User();
    try {
        // =======================================
        // creating new user
        newUser = await User.findOne({
            where: {
                userName: username
            }
        })

        if (newUser === null) {
            // 
            let hashedPass = password
            bcrypt.hash(hashedPass, 10, async (err, hash) => {
                await Model.create({fullName: fullname , userName: username , password: hash, userType: usertype, 
                    birthate: birthdate, phoneNumber: phonenumber });
            })
            console.log(`${username} created.`)
            return [true, "نام کاربری با موفقیت ایجاد شد"]

        } else {
            console.log(`can't create ${username}`)
            return [false, "نام کاربری موجود است"]
        }
        // =======================================
    } catch (err) {
        //console.log(`${err}`)
        return [false, `${err}`]
    }
}
