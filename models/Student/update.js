const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE STUDENT INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param id
 * @param socialID
 * @param parentsName
 * @param parentNumber
 * @param fullName
 * @param sex
 * @param phoneNumber
 * @param birthDate
 * @param address
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id, socialID, parentsName, parentNumber, fullName, sex, phoneNumber, birthDate, address ) => {
    
    try {
        // count number of element that changed 
        let check = null
        // find student with social ID 

        const student = await db().sequelize.models.Student.findOne({
            where: {
                id: id
            }
        })

        // check new social id is not reserve for another person in the system
        if(student.socialID != socialID) {
            check = await db().sequelize.models.Person.findOne({
                where: {
                    socialID: socialID
                }
            })
        }
        
        // find person with Social ID
        const person = await db().sequelize.models.Person.findOne({
          where: {
              id: student.dataValues.PersonId
          }  
        })

        if(check === null){
            student.update({parentsName: parentsName, socialID: socialID, parentNumber: parentNumber})
            person.update({fullName: fullName, socialID: socialID, sex: sex, phoneNumber: phoneNumber, birthDate: birthDate, address: address})

            const msg = message.request('update',true ,socialID)
            log.record('info', msg)
            return [true, message.show(true)]
    
        } else {
            const msg = message.check(true, socialID)
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}

