const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME TOPIC
// ================================================================================
module.exports = async (id) => {
    try {
        // select * from Topic where id == id 
        let info = await db().sequelize.models.Topic.findAll({
            where: {
                id: id
            },
            nest: false,
            raw: true
        })

        if (info !== null) {
            log.record('info', message.request('read', true, info.name))
            info = info[0]
            let result =
                {
                    topID: info.id,
                    name: info.name,
                    level: info.level,
                    length: info.length,
                    desc: info.description,
                }

            return [true, result]

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
