const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// ADD NEW Topic
// ================================================================================
/**
 * add Topic to DB
 * @param name
 * @param level
 * @param length
 * @param desc
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (name, level, length, desc) => {
    let newTop
    try {

        // check existing
        newTop = await db().sequelize.models.Topic.findOne({
            where: {
                name: name
            }
        })

        // if new Topic does not exist create it. 
        if (newTop === null) {
            const holder = await db().sequelize.models.Level.create({name: name, level: level, length: length, description: desc});
            
            const msg = message.request('create', true, holder.id)
            log.record('info', msg)
            return [true, message.show(true, 'create')]

        } else {
            const msg = message.check(true, name)
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
