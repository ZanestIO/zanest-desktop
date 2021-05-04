const db = require('../Db.js')
const sequelize = require('sequelize')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const Op = sequelize.Op

// ================================================================================
// RETURN INFO OF SOME TEACHER
// ================================================================================
module.exports = async (searchBy, value) => {

    try {
        // 
        let info
        // select * from TEACHER, person where socialID == sid 
        if (searchBy === 'name') {
            info = await db().sequelize.models.Person.findAll({
                where: {
                    fullName: {
                        [Op.substring]: value
                    },
                    personType: "tch"
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ["fullName", "socialID", "phoneNumber"],
                offset: 0,
                limit: 7
            })

        } else if (searchBy === 'id') {
            // TODO: fix search Issue
            info = await db().sequelize.models.Person.findAll({
                where: {
                    socialID: {
                        [Op.substring]: value
                    },
                    personType: "tch"
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ["fullName", "socialID", "phoneNumber"],
                offset: 0,
                limit: 7
            })
        }
        let results = []
        if (info[0]) {
            log.record('info', message.request('search', 'teacher', true, value))
            info.forEach(node => {
                holder = {
                    fullName: node.dataValues.fullName,
                    socialID: node.dataValues.socialID,
                    phoneNumber: node.dataValues.phoneNumber,
                }
                results.push(holder)
            })
            return results

        } else {
            log.record('info', message.request('search', 'teacher', false, value))
            return false
        }

        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
