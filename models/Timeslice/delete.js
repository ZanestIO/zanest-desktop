const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const db = require('../Db.js');

// ================================================================================
// DELETE TIMESLICE
// ================================================================================
/**
 * delete Timeslice object from DB,
 * @param id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id) => {
    let ts
    try {
        // check TimeSlice exist
        ts = await db().sequelize.models.TimeSlice.findOne({
            where: {
                id: id
            }
        })

        if (ts !== null) {
            await db().sequelize.models.TimeSlice.destroy({
                where: {
                    id: id
                }
            })
             
            const msg = message.request('delete', true, id, 'timeSlice')
            log.record('info', msg )
            return [true, message.show(true, 'delete', 'بازه زمانی')]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        if(err == "SequelizeForeignKeyConstraintError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
            return [false, message.constraintError('بازه زمانی ')]
        } else {
            return [false, err]
        }
        
    }
}
