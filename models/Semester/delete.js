const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// DELETE A SEMESTER
// ================================================================================
/**
 * delete Semester
 * @param id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id) => {
    let semester
    try {
        // check semester exist
        const db = require('../Db.js');
        semester = await db().sequelize.models.Semester.findOne({
            where: {
                id: id
            }
        })

        // if semester exist delete 
        if (semester !== null) {
            await db().sequelize.models.Semester.destroy({
                where: {
                    id: id
                }
            });

            // 
            const msg = message.request('delete', true, id, 'semester')
            log.record('info',msg )
            return [true, message.show(true, 'delete', 'ترم تحصیلی')]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
