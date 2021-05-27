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
module.exports = async (name, address, phoneNumber) => {
    try {
        // find institution with id
        const ins = await db().sequelize.models.Institution.findOne({
            where: {
                id: 1
            }
        })

        if (ins != null){
            ins.update({name: name, address: address, phoneNumber: phoneNumber})
            const msg = message.request('update', true, 'Institution')
            log.record('info', msg)

            return [true, message.show(true, 'update', 'اطلاعات آموزشگاه')]
        } else {
            log.record('error', 'update institution error' + __filename)
            return [false, message.show(false, 'update', 'اطلاعات اموزشگاه')]
        }

        
    } catch (err) {
        log.record('error', err +":in" + __filename)
        return [false, err]
    }
}
