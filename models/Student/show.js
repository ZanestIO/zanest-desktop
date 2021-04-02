// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (sid) => {
    try {

        const db = require('../Db.js');
        const {Person} = require('./../Person/Person')

        // select * from student, person where socialID == sid
        let info = await db().sequelize.models.Student.findAll({
            where: {
                socialID: sid
            },
            include: {
                model: Person,
            },
            nest: false,
            raw: true
        })

        if (info !== null) {
            console.log(`searched for ${sid}.`)
            info = info[0]
            console.log(info['Person.fullName'])
            let result =
                {
                    fullName: info['Person.fullName'],
                    phoneNumber: info['Person.phoneNumber'],
                    sex: info['Person.sex'],
                    birthDate: info['Person.birthDate'],
                    address: info['Person.address'],
                    socialID: info.socialID,
                    parentNumber: info.parentNumber,
                    parentsName: info.parentName,
                }
            return [true, result]
        } else {
            console.log(`${sid} not found`)
            return [false, 'زبان آموز در سیستم موجود نیست']
        }
        // =======================================
    } catch (err) {
        console.log("im exception")
        console.log(err.msg)
        return [false, err.msg]
    }
}
