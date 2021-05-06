const {log} = require('./../../logger')

// ================================================================================
// RETURN INFO OF SOME TEACHER
// ================================================================================
module.exports = async (limit, offset) => {
    let info
    let teachers = []
    try {
        
        const db = require('./../Db');
        const {Person} = require('../Person/Person');
        
        // select * from teacher, person where socialID == sid
        info = await db().sequelize.models.Teacher.findAll({
            include: {
              model: Person
            },
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (offset - 1) * limit,
            limit: limit,
            nest: false
        })
        // converts a info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let teacher = {
                fullName: node.Person.fullName,
                phoneNumber: node.Person.phoneNumber,
                sex: node.Person.sex,
                socialID: node.socialID,
                birthDate: node.Person.birthDate,
                credit: node.credit,
                address: node.Person.address,
                degree: node.degree,
            }
            teachers.push(teacher)
        })

        return teachers

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}
