const db = require('../Db.js')
const sequelize = require('sequelize')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const Op = sequelize.Op
// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (searchBy, value) => {
    try {
        // 
        let info
        // select * from student, person where socialID == sid 
        if (searchBy === 'name') {
            info = await db().sequelize.models.Person.findAll({
                where: {
                    fullName: {
                        [Op.substring]: value
                    },
                    personType: "std"
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ["fullName", "socialID", "phoneNumber"],
                offset: 0,
                limit: 5
            })

        } else if (searchBy === 'id') {

            info = await db().sequelize.models.Person.findAll({
                where: {
                    socialID: {
                        [Op.substring]: value
                    },
                    personType: "std"
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ["fullName", "socialID", "phoneNumber"],
                offset: 0,
                limit: 5
            })
        }

        let results = []
        if (info[0]) {
            log.record('error', message.request('search', true, value,'student'))
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
            log.record('error', message.request('search',false, value, 'student'))
            return false
        }

        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
