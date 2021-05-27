const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// ADD NEW CLASS ROOM
// ================================================================================
/**
 * add CLASS ROOM to DB
 * @param name
 * @param capacity
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (name, capacity) => {
    let newCR
    try {

        // search in database
        newCR = await db().sequelize.models.ClassRoom.findOne({
            where: {
                name: name
            }
        })

        // if new Class Room name not exist then create it. 
        if (!newCR) {
            const holder = await db().sequelize.models.ClassRoom.create({name: name, capacity: capacity});

            const msg = message.request('create', true, holder.id, 'classRoom')
            log.record('info', msg)
            return [true, message.show(true, 'create', 'کلاس فیزیکی')]

        } else {
            const msg = message.check(false, newCR.id)
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
