const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE User INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param fullName
 * @param username
 * @param password
 * @param userType
 * @param birthDate
 * @parm phonenumber
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (fullname, username, password, usertype, birthdate, phonenumber) => {
    
    try {
        // count number of element that changed 
        let changed = 0
        const oldUserName = username
        // find user with social ID 
        const user = await db().sequelize.models.User.findOne({
            where: {
                userName: username
            }
        })

        // check update for User
        if (user !== null) {
            if(user.fullName !== fullname) {
                user.fullName = fullname
                changed += 1
            }
            if(user.username !== username){
                user.username = username
                changed += 1
            }
            if(user.password !== password) {
                user.password = password
                changed += 1
            }
            if(user.userType !== usertype) {
                user.userType = usertype
                changed += 1
            }
            if(user.birthDate !== birthdate) {
                user.birthDate = birthdate
                changed += 1
            }
            if(user.phoneNumber !== phonenumber) {
                user.phoneNumber = phonenumber
                changed += 1
            }
            await user.save()
        }

        const msg = message.request('update', fullName, true ,oldUserName) + `(تغییرات:${changed})`
        log.record('info', msg)
        return [true, msg ]
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}

