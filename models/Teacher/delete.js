const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// DELETE TEACHER
// ================================================================================
/**
 * delete teacher object from DB,
 * but keep his/her personal info
 * @param sid
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid) => {
    let teacher
    try {
        // check teacher exist
        const db = require('../Db.js');
        teacher = await db().sequelize.models.Teacher.findOne({
            where: {
                socialID: sid
            }
        })

        if ( teacher !== null) {
            
            await db().sequelize.models.Teacher.destroy({
                where: {
                    socialID: sid
                }
            });
            // 
            const msg = message.request('delete', 'teacher', true, sid)
            log.record('info',msg )
            return [true, msg]

        } else {
            const msg = message.check('teacher', false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
