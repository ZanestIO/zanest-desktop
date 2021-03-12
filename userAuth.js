// handles user Authentication
const bcrypt = require('bcrypt');

module.exports = async (username, password, db) => {
    let user = await usernameExists(username, db)

    if (user) {
        let passMatch = false;
        passMatch = await passwordMatches(user, password, db)
        if (passMatch) {
            return [true, {
                id: user.dataValues.id,
                fullName: user.dataValues.fullName,
                userName: user.dataValues.userName,
                userType: user.dataValues.userType
            }]
        } else {
            return [false, {
                password: "رمز عبور واردشده اشتباه است"
            }]
        }
    } else {
        return [false, {
            userName: "نام کاربری در سیستم موجود نیست"
        }]
    }
}

async function usernameExists(input_username,db) {
    return await db.models.User.findOne({
        where: {
            userName: input_username
        }
    })
}

function passwordMatches(user, input_password, db) {
    let hashedPassword = user.dataValues.password
    return bcrypt.compare(input_password, hashedPassword)
}