const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// CREATE A NEW TEACHER
// ================================================================================
/**
 * creates a new teacher with given args
 * and add it to DB
 * @param sid
 * @param credit
 * @param degree
 * @param fullName
 * @param sex
 * @param phoneNumber
 * @param birthDate
 * @param address
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid, credit, degree, fullName, sex, phoneNumber, birthDate, address) => {
    let newTch
    try {
        // check if TEACHER exist
        newTch = await db().sequelize.models.Teacher.findOne({
            where: {
                socialID: sid
            }
        })
        // if new TEACHER does not exist create it. 
        if (newTch === null) {
            
            let personHolder = await db().sequelize.models.Person.create({fullName: fullName, socialID: sid, address: address,
                 sex: sex, birthDate: birthDate, phoneNumber: phoneNumber, personType: "tch" })

            const PersonId = personHolder.dataValues.id

            await db().sequelize.models.Teacher.create({socialID: sid, credit: credit,
                degree: degree, PersonId: PersonId });

            const msg = message.request('create', true, sid)
            log.record('info', msg)
            return [true, message.show(true)]

        } else {
            const msg = message.check(true, sid)
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
