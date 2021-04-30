const {log} = require('./../../logger')
const message = require('./../../controler/massege')

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
        const db = require('../Db.js');
        user = await db().sequelize.models.User.findOne({
            where: {
                userName: username
            }
        })

        if (user !== null) {
            await db().sequelize.models.User.destroy({
                where: {
                    userName: username
                }
            });
            // check message 
            const msg = message.request('delete', 'User', true, username )
            log.record('info',msg )
            return [true, msg]

        } else {
            const msg = message.check('User', false, username)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
