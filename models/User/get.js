const {log} = require('./../../logger')
const db = require('./../Db');

// ================================================================================
// RETURN INFO OF SOME USER
// ================================================================================
module.exports = async (limit, offset) => {
    let info
    let users = []
    try {

        // get info 
        info = await db().sequelize.models.User.findAll({
            offset: offset,
            limit: limit,
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let user = {
                fullName: info.fullName,
                userType: info.userType,
            }
            users.push(user)
        })

        return users

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}