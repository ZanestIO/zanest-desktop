const {log} = require('./../../logger')
const db = require('./../Db');

// ================================================================================
// RETURN INFO OF SOME USER
// ================================================================================
module.exports = async (curentUser) => {
    let info
    let users = []
    try {

        // get info 
        info = await db().sequelize.models.User.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            // we have just one manager that access to user management module
            let isCurrent = node.userName === curentUser
            let user = {
                id: node.id,
                fullName: node.fullName,
                userType: node.userType,
                userName: node.userName,
                curentUser: isCurrent
            }

            // don't send the default admin user
            if (isCurrent) {
                users.unshift(user)
            } else if (user.userType !== 'admin')
                users.push(user)
        })

        return users

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}