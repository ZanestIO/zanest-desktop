const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE TEACHER INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param oldSid
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
module.exports = async (oldSid, socialID, credit, degree, fullName, sex, phoneNumber, birthDate, address ) => {
    
    try {
        // count number of element that changed 
        let changed = 0

        // find teacher with social ID 
        const teacher = await db().sequelize.models.Teacher.findOne({
            where: {
                socialID: socialID
            }
        })

        // find person with Social ID
        const person = await db().sequelize.models.Person.findOne({
          where: {
              id: teacher.dataValues.PersonId
          }  
        })

        // check update for teacher
        if (teacher !== null) {
            if(teacher.credit !== credit) {
                teacher.credit = credit
                changed += 1
            }
            if(teacher.socialID !== socialID) {
                teacher.socialID = socialID
                changed += 1
            }
            if(teacher.degree !== degree) {
                teacher.degree = degree
                changed += 1
            }
            await teacher.save()
        } 
        
           // check update for person
        if (person !== null) {
            if(person.fullName !== fullName) {
                person.fullName = fullName
                changed += 1
            }
            if(teacher.socialID !== socialID) {
                teacher.socialID = socialID
                changed += 1
            }
            if(person.sex !== sex) {
                person.sex = sex
                changed += 1
            }
            if(person.phoneNumber !== phoneNumber) {
                person.phoneNumber = phoneNumber
                changed += 1
            }
            if(person.birthDate !== birthDate) {
                person.birthDate = birthDate
                changed += 1
            }
            if(person.address !== address) {
                person.address = address
                changed += 1
            }
            await person.save()
        }

        const msg = message.request('update', fullName, true ,oldSid) + `(تغییرات:${changed})`
        log.record('info', msg)
        return [true, msg ]
        
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}

