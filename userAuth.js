// handles user Authentication
const bcrypt = require('bcrypt');

module.exports = async (username, password, db) => {
    let userId = await usernameExists(username, db)

    if (userId) {
        let passMatch = false;
        passMatch = await passwordMatches(userId, password, db)
        if (passMatch)
            return [true, '']
        else {
            return [false, "رمز عبور واردشده اشتباه است"]
        }
    } else {
        return [false, "نام کاربری در سیستم موجود نیست"]
    }
}

async function usernameExists(input_username,db) {
    let userId = false
    userId =await db.models.User.findOne({
        attributes: ['id'],
        where: {
            userName: input_username
        }
    })

    // find if user exists in the db
    return userId.dataValues.id
}

async function passwordMatches(userId, input_password, db) {
    let user = await db.models.User.findOne({
        attributes: ['password'],
        where: {
            id: userId
        }
    })

    let hashedPassword = user.dataValues.password
    // let userType = user.then.
    return bcrypt.compare(input_password, hashedPassword)
}