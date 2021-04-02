const Model = require('sequelize');
const db = require('../Db.js');


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
        // TODO : only check for student
        newStd = await db().sequelize.models.Person.findOne({
            where: {
                socialID: sid
            }
        })

        if (newStd === null) {
            
            let personHolder = await db().sequelize.models.Person.create({fullName: fullName, socialID: sid, address: address,
                 sex: sex, birthDate: birthDate, phoneNumber: phoneNumber })

            console.log(`${sid} before student.`)
            const PersonId = personHolder.dataValues.id
            await db().sequelize.models.Student.create({socialID: sid, parentName: parentName, parentNumber: parentNumber, PersonId: PersonId});

            // 
            console.log(`${sid} created.`)
            return [true, "زبان اموز با موفقیت ایجاد شد"]

        } else {

            // 
            console.log(`can't create ${sid}`)
            return [false, "زبان اموز در سیستم موجود است"]
        }

        // =======================================
    } catch (err) {

        console.log(err)
        return [false, err]
    }
}
