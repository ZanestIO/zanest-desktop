const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
//  UPDATE STUDENT INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param sid
 * @param parentname
 * @param parentnumber
 * @param fullname
 * @param sex
 * @param phonenumber
 * @param birthdate
 * @param address
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid, parentname, parentnumber, fullname, sex, phonenumber, birthdate, address) => {
    
    try {
        
        // count number of element that changed 
        let changed = 0

        // find student with social ID 
        // TODO: add old sid
        const student = await db().sequelize.models.Student.findOne({
        where: {
                socialID: sid
            }
        })

        // find person with Social ID
        const person = await db().sequelize.models.Person.findOne({
          where: {
              socialID: sid
          }  
        })

        // check update for student
        if (student !== null) {
            if(student.parentname !== parentname) {
                student.parentname = parentname
                changed += 1
            }
            if(student.parentnumber !== parentnumber) {
                student.parentnumber = parentname
                changed += 1
            }
            await student.save()

        } else {
            console.log("info of student tabe don't change")
        }

        // check update for person
        if (person !== null) {
            if(person.fullname !== fullname) {
                person.parentname = parentname
                changed += 1
            }
            if(person.sex !== sex) {
                person.sex = sex
                changed += 1
            }
            if(person.phonenumber !== phonenumber) {
                person.phonenumber = phonenumber
                changed += 1
            }
            if(person.birthdate !== birthdate) {
                person.birthdate = birthdate
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
        
        console.log(`changed ${changed} elements of ${sid}`)
        return [true, 'تغییرات با موفقیت ثبت شد']
        

        // =======================================
    } catch (err) {

        console.log(err.msg)
        return [false, err.msg]
    }
}

