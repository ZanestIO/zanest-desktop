const {log} = require('./../../logger')
const db = require('./../Db');

// ================================================================================
// RETURN INFO OF SOME TOPIC
// ================================================================================
module.exports = async () => {
    let info
    let topics = []
    try {
        // get info 
        info = await db().sequelize.models.Topic.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let topic = {
                id: node.id,
                name: node.name,
            }

            topics.push(topic)
        })

        return topics

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}