const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const db = require('../Db.js');
// ================================================================================
// DELETE USER
// ================================================================================
/**
 * delete User object from DB,
 * but keep his/her personal info
 * @param sid
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (username) => {
    let user
    try {
        // check User exist
        user = await db().sequelize.models.User.findOne({
            where: {
                userName: username
            }
        })
        console.log(username)
        if (user !== null) {
            await db().sequelize.models.User.destroy({
                where: {
                    userName: username
                }
            });
            // check message 
            const msg = message.request('delete', true, username, 'user')
            log.record('info',msg )
            return [true, message.show(true, 'delete', 'کاربر')]

        } else {
            const msg = message.check(false, username)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
