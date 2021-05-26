const {log} = require('./../../logger')
const db = require('./../Db');

// ================================================================================
// RETURN INFO OF SOME CLASSROOM
// ================================================================================
module.exports = async () => {
    let info
    let classRooms = []
    try {
        // get info 
        info = await db().sequelize.models.ClassRoom.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let room = {
                id: node.id,
                name: node.name,
                capacity: node.capacity
            }
            classRooms.push(room)
        })

        return classRooms

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}