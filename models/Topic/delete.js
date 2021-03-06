const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const db = require('../Db.js');

// ================================================================================
// DELETE TOPIC
// ================================================================================
/**
 * delete Topic object from DB,
 * @param id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id) => {
    let topic
    try {
        // check Topic exist
        topic = await db().sequelize.models.Topic.findOne({
            where: {
                id: id
            }
        })

        if (topic !== null) {
            await db().sequelize.models.Topic.destroy({
                where: {
                    id: id
                }
            });
            // 
            const msg = message.request('delete', true, id, 'topic')
            log.record('info', msg )
            return [true, message.show(true, 'delete', 'سرفصل')]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        if(err == "SequelizeForeignKeyConstraintError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
            return [false, message.constraintError('سرفصل')]
        } else {
            return [false, err]
        }
    }
}
