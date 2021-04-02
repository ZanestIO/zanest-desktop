const db = require('../Db.js')
const sequelize = require('sequelize')
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
                    }
                },
                attributes: ["fullName", "socialID", "phoneNumber"],

            })

        } else if (searchBy === 'id') {

            info = await db().sequelize.models.Person.findAll({
                attributes: ["fullName", "socialID", "phoneNumber"],
                where: {
                    socialID: {
                        [Op.substring]: value
                    }
                },
                offset: 1,
                limit: 5
            })
        }
        let results = []
        if (info[0]) {
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
            return false
        }

        // =======================================
    } catch (err) {
        console.log(err.msg)
        return [false, err.msg]
    }
}
