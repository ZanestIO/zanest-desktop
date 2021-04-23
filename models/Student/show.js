const db = require('../Db.js');
const {Person} = require('./../Person/Person')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (sid) => {
    try {

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
            log.record('info', message.request('read', 'student', true, sid))
            info = info[0]

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
            const msg = message.check('Student', false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
