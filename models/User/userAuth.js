const bcrypt = require('bcrypt');
const db = require('./../Db.js')
// ================================================================================
// handles user Authentication
// ================================================================================
module.exports = {

    // ==================================================================================
    // Logs In Or Throws Error
    /**
     * check if the given username and password
     * is correct or not
     * @param username
     * @param password
     * @returns {Promise<(boolean|{fullName, id, userType: (string|{default: string, allowNull: boolean, type: *}|*), userName: (string|{allowNull: boolean, type: *}|*)})[]|(boolean|{password: string})[]|(boolean|{userName: string})[]>}
     */
    async login(username, password) {
        console.log('im here =================================================================')
        console.log(db)
        let user = await usernameExists(username)

        // if there is a user
        if (user) {
            // compare password
            let passMatch = false;
            passMatch = await passwordMatches(user, password)

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
            // if there is no user with given username
        } else {
            return [false, {
                userName: "نام کاربری در سیستم موجود نیست"
            }]
        }
    },

    // ==================================================================================
    // Checks For Existence Of User Type
    /**
     * check if the given userType exists
     * in the DB or not
     * @param input_usertype
     * @returns {Promise<boolean>}
     */
    async userTypeExists(input_usertype) {
        let user = await db().sequelize.models.User.findOne({
            where: {
                userType: input_usertype
            }
        })

        return user !== null;
    }
} // end of UserAuthenticator

// ===================================================================================================
// finds user in the database
/**
 * check if the given username exists
 * in the DB or not
 * @param input_username
 * @returns {Promise<Model<TModelAttributes, TCreationAttributes>|null>}
 */
async function usernameExists(input_username) {
    return await db().sequelize.models.User.findOne({
        where: {
            userName: input_username
        }
    })
}

// ===================================================================================================
// compares two passwords
/**
 * check if the user's password is
 * equal to hashed password or not
 * @param user
 * @param input_password
 * @returns {void|*}
 */
function passwordMatches(user, input_password) {
    let hashedPassword = user.dataValues.password
    return bcrypt.compare(input_password, hashedPassword)
}