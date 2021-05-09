const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE TEACHER INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param id
 * @param socialID
 * @param credit
 * @param degree
 * @param fullName
 * @param sex
 * @param phoneNumber
 * @param birthDate
 * @param address
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id, socialID, credit, degree, fullName, sex, phoneNumber, birthDate, address ) => {
    try {
        // count number of element that changed 
        let check = null
        // find teacher with social ID 
        const teacher = await db().sequelize.models.Teacher.findOne({
            where: {
                id: id
            }
        })

        // check new social id is not reserve for another person in the system
        if(teacher.socialID != socialID) {
            check = await db().sequelize.models.Person.findOne({
                where: {
                    socialID: socialID
                }
            })
        }

        // find person with Social ID
        const person = await db().sequelize.models.Person.findOne({
            where: {
                id: teacher.dataValues.PersonId
            }
        })
        if(check === null){
            teacher.update({credit: credit, socialID: socialID, degree: degree})
            person.update({fullName: fullName, socialID: socialID, sex: sex, phoneNumber: phoneNumber, birthDate: birthDate, address: address})

            const msg = message.request('update',true ,socialID, 'teacher')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'استاد')]

        } else {
            const msg = message.check(true, socialID)
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}

