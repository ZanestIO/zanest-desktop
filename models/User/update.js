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
 * @param fullname
 * @param username
 * @param password
 * @param usertype
 * @param birthdate
 * @param phonenumber
 * @parm phonenumber
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (id, fullname, username, password, usertype, birthdate, phonenumber) => {
    
    try {
        // count number of element that changed 
        let check = null

        // find user with id
        const user = await db().sequelize.models.User.findOne({
            where: {
                id: id
            }
        })

        // Don't update if user with new username exist
        if (user.userName != username){
            check = await db().sequelize.models.User.findOne({
                where: {
                    userName: username
                }
            })
        }

        // if username doesn't already exist updated with new value
        if (check === null){
            let pass
            if (password) {
                bcrypt.hash(password, 10,  async (err, hash) => {
                    pass = hash
                    console.log("1===========================================================" + hash)
                    await user.update({fullName: fullname, userName: username, password: pass, userType: usertype,
                        birthDate: birthdate, phoneNumber: phonenumber})
                })
            } else {
                pass = user.password
                await user.update({fullName: fullname, userName: username, password: pass, userType: usertype,
                    birthDate: birthdate, phoneNumber: phonenumber})
            }

            const msg = message.request('update',true ,username, 'user')
            await log.record('info', msg)
            return [true, message.show(true, 'update', 'کاربر')]

        } else {
            // else show already exist message
            const msg = message.check(true, username)
            await log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        await log.record('error', err)
        return [false, err]
    }
}
