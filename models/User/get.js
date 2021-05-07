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
                ['createdAt', 'DESC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let user = {
                fullName: node.fullName,
                userType: node.userType,
                userName: node.username,
                // we have just one manager that access to user managment module
                currentUser: function() {
                    return node.username === curentUser ? true : false
                }
            }
            users.push(user)
        })

        return users

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}