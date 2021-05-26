const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE CLASSROOM INFO 
// ================================================================================
/**
 * update classRoom attributes
 * @param id
 * @param name
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (id, name, capacity) => {
    try {
        let check = null

        // find class room with id
        const cr = await db().sequelize.models.ClassRoom.findOne({
            where: {
                id: id 
            }
        })

        // check
        if(cr.name != name){
            check = await db().sequelize.models.ClassRoom.findOne({
                where: {
                    name: name
                }
            })
        }

        // if new class room info desn't have conflict, updated with new value
        if ( check == null ){
            cr.update({name: name, capacity: capacity})

            const msg = message.request('update', true, cr.id, 'classRoom')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'کلاس فیزیکی')]
            
        } else {
            // else show already exist message
            const msg = message.check(true, name)
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}
