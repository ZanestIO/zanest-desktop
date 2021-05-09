const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE TOPIC INFO 
// ================================================================================
/**
 * update attributes that topic has changed in DB
 * @param id
 * @param name
 * @param level
 * @param length
 * @parm description
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (id, name, level, length, desc) => {
    
    try {

        let check = null

        // find topic with id
        const topic = await db().sequelize.models.Topic.findOne({
            where: {
                id: id
            }
        })

        // if topic with new topic exist don't update
        if (topic.name != name){
            check = await db().sequelize.models.Topic.findOne({
                where: {
                    name: name
                }
            })
        }

        // if topic name doesn't already exist updated with new value
        if (check === null){
            topic.update({name: name, level: level, length: length, description: desc})
            const msg = message.request('update',true ,name, 'topic')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'سرفصل')]
            
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
