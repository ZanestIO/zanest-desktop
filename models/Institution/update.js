const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
// ================================================================================
//  UPDATE INSTITUTION INFO 
// ================================================================================
/**
 * update Institution attributes
 * @param name
 * @param address
 * @param phoneNumber
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (name, address, phone) => {
    try {
        // find institution with id
        const ins = await db().sequelize.models.Institution.findOne({
            where: {
                id: 1
            }
        })

        ins.update({name: name, address: address, phone: phone})

        const msg = message.request('update', true, 'Institution')
        log.record('info', msg)

        return [true, message.show(true, 'update', 'اطلاعات آموزشگاه')]
        
    } catch (err) {
        log.record('error', err +":in" + __filename)
        return [false, err]
    }
}
