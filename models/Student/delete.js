const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// delete a Student
// ================================================================================
/**
 * delete student object from DB,
 * but keep his/her personal info
 * @param sid
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid) => {
    let student
    try {
        // check student exist
        const db = require('../Db.js');
        student = await db().sequelize.models.Student.findOne({
            where: {
                socialID: sid
            }
        })

        if (student !== null) {
            
            await db().sequelize.models.Student.destroy({
                where: {
                    socialID: sid
                }
            });
            // 
            const msg = message.request('delete', 'student', true, sid)
            log.record('info',msg )
            return [true, msg]

        } else {
            const msg = message.check('student', false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
