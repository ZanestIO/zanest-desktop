const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const bcrypt = require('bcrypt')

// ================================================================================
//  UPDATE User INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param id
 * @param fullName
 * @param username
 * @param password
 * @param userType
 * @param birthDate
 * @parm phonenumber
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (id, fullname, username, password, usertype, birthdate, phonenumber) => {
    
    try {
        // count number of element that changed 
        let check = null
        // find user with Username
        const user = await db().sequelize.models.User.findOne({
            where: {
                id: id
            }
        })

        // Don't update if user with new username exist
        if (user.username != username){
            check = await db().sequelize.models.User.findOne({
                where: {
                    userName: username
                }
            })
        }
        
        // if username doesn't already exist updated with new value
        if (check === null){
            const pass = bcrypt.hash(password, 10)
            user.update({fullName: fullname, userName: username, password: pass, userType: usertype,
                 birthdate: birthdate, phoneNumber: phonenumber})
            
            const msg = message.request('update',true ,socialID)
            log.record('info', msg)
            return [true, message.show(true)]
        } else {
            // else show already exist message
            const msg = message.check(true, username)
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}
