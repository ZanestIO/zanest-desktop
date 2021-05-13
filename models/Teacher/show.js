const db = require('../Db.js');
const {Person} = require('./../Person/Person')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME TEACHER
// ================================================================================
module.exports = async (sid) => {
    try {

        // select * from teacher, person where socialID == sid
        let info = await db().sequelize.models.Teacher.findAll({
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
            log.record('info', message.request('read', true, sid, 'teacher'))
            info = info[0]

            let result =
                {
                    id: info.id,
                    fullName: info['Person.fullName'],
                    phoneNumber: info['Person.phoneNumber'],
                    sex: info['Person.sex'],
                    birthDate: info['Person.birthDate'],
                    address: info['Person.address'],
                    socialID: info.socialID,
                    credit: info.credit,
                    degree: info.degree,
                }
            return [true, result]

        } else {
            const msg = message.check(false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}

