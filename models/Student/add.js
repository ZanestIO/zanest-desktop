const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// creates the New Student
// ================================================================================
/**
 * creates a new student with given args
 * and add it to DB
 * @param sid
 * @param parentName
 * @param parentNumber
 * @param fullName
 * @param sex
 * @param phoneNumber
 * @param birthDate
 * @param address
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid, parentName, parentNumber, fullName, sex, phoneNumber, birthDate, address) => {
    let newStd
    try {

        // check if netStd exist
        newStd = await db().sequelize.models.Student.findOne({
            where: {
                socialID: sid
            }
        })
        // if new student does not exist create it. 
        if (newStd === null) {
            
            let personHolder = await db().sequelize.models.Person.create({fullName: fullName, socialID: sid, address: address,
                 sex: sex, birthDate: birthDate, phoneNumber: phoneNumber, personType: "std" })

            const PersonId = personHolder.dataValues.id
            await db().sequelize.models.Student.create({socialID: sid, parentName: parentName, parentNumber: parentNumber, PersonId: PersonId});

            const msg = message.request('create', fullName, true, sid)
            log.record('info', msg)
            return [true, msg]

        } else {
            const msg = message.check(fullName, true, sid)
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
