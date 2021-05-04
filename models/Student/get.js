const {log} = require('./../../logger')

// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (limit, offset) => {
    let info
    let students = []
    try {
        const db = require('./../Db');
        const {Person} = require('../Person/Person');

        // select * from student, person where socialID == sid
        info = await db().sequelize.models.Student.findAll({
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
            let student = {
                fullName: node.Person.fullName,
                phoneNumber: node.Person.phoneNumber,
                sex: node.Person.sex,
                socialID: node.socialID,
                birthDate: node.Person.birthDate,
                parentNumber: node.parentNumber,
                address: node.Person.address,
                parentsName: node.parentName,
            }
            students.push(student)
        })

        return students

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}