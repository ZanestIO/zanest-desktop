const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const db = require('../Db.js');

// ================================================================================
// DELETE CLASSROOM
// ================================================================================
/**
 * delete class room object from DB,
 * @param id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id) => {
    let cr
    try {
        // check Class Room exist
        cr = await db().sequelize.models.ClassRoom.findOne({
            where: {
                id: id
            }
        })

        if (cr !== null) {
            await db().sequelize.models.ClassRoom.destroy({
                where: {
                    id: id
                }
            });
            //  
            const msg = message.request('delete', true, id, 'classRoom')
            log.record('info', msg )
            return [true, message.show(true, 'delete', 'کلاس فیزیکی')]

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
