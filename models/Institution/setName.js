const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE INSTITUTION NAME 
/**
 * update Institution name
 * @param name
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (name) => {
    try {
        // find institution with id
        const ins = await db().sequelize.models.Institution.findOne({
            where: {
                id: 1
            }
        })

        if ( ins != null ){
            ins.name = name;
            await ins.save();

            const msg = message.request('update', true, 'Institution')
            log.record('info', msg)

            return [true]

        } else {
            log.record('error', 'update institution error' + __filename)
            return [false]
        }

    } catch (err) {
        log.record('error', err +":in" + __filename)
        return [false, err]
    }
}
