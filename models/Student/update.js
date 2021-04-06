// ================================================================================
//  UPDATE STUDENT INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param oldSid
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
module.exports = async (oldSid, socialID, parentsName, parentNumber, fullName, sex, phoneNumber, birthDate, address ) => {
    
    try {
        const db = require('../Db.js');
        // count number of element that changed 
        let changed = 0



        // find student with social ID 
        // TODO: add old sid
        const student = await db().sequelize.models.Student.findOne({
            where: {
                socialID: socialID
            }
        })



        // find person with Social ID
        const person = await db().sequelize.models.Person.findOne({
          where: {
              id: student.dataValues.PersonId
          }  
        })

        console.log(student)

        // check update for student
        if (student !== null) {
            if(student.parentName !== parentsName) {
                student.parentName = parentsName
                changed += 1
            }
            if(student.socialID !== socialID) {
                student.socialID = socialID
                changed += 1
            }
            if(student.parentNumber !== parentNumber) {
                student.parentNumber = parentNumber
                changed += 1
            }
            await student.save()

        } else {
            console.log("info of student tabe don't change")
        }

        console.log('im person')
        console.log(person)


        // check update for person
        if (person !== null) {
            if(person.fullName !== fullName) {
                person.fullName = fullName
                changed += 1
            }
            if(student.socialID !== socialID) {
                student.socialID = socialID
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
        } else {
            console.log("info of Person table don't change")
        }

        // return true if any thing changed and return false if nothing changed
        console.log(`changed ${changed} elements of ${socialID}`)
        return [true, 'تغییرات با موفقیت ثبت شد']
        

        // =======================================
    } catch (err) {
        console.log('im exception')
        console.log(err.msg)
        return [false, err.msg]
    }
}

