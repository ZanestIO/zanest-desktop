const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// delete a Student
// ================================================================================
/**
 * delete student object from DB,
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
            await db().sequelize.models.Person.destroy({
                where: {
                    socialID: sid
                }
            })
            // 
            const msg = message.request('delete', true, sid, 'student')
            log.record('info',msg )
            return [true, message.show(true, 'delete', 'زبان آموز')]

        } else {
            const msg = message.check(false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
