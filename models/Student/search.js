const Model = require('sequelize');
const db = require('../Db.js');
const Op = require('sequelize')

// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (searchBy, value) => {
    const info
    try {
        // 

        // select * from student, person where socialID == sid 
        if (searchBy === 'name') {

            info = await db().sequelize.models.Student.findAll({
                include: [{
                    model: Person,
                    as: 'info',
                    attributes: ["fullName", "socialID", "phoneNumber"],
                    where: {
                        fullName:{
                            [Op.like]: `${value}%`
                        }
                    },
                    offset: 10,
                    limit: 2
                }]
            })

        } else if (searchBy === 'id') {

            info = await db().sequelize.models.Student.findAll({
                include: [{
                    model: Person,
                    as: 'info',
                    attributes: ["fullName", "socialID", "phoneNumber"],
                    where: {
                        socialID: {
                            [Op.like]: value

                        }
                    },
                    offset: 10,
                    limit: 3
                }]
            })
        }

        return info
        // =======================================
    } catch (err) {

        console.log(err.msg)
        return    [
                 {
                     name: '-error-',
                     sid: '-error-',
                     phone:'-error',
                 }
             ]
    }
}
