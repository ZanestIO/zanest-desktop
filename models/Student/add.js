const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
// creates the New Student
// ================================================================================
/**
 * creates a new student with given args
 * and add it to DB
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
    let newStd
    try {
        // check if netStd exist
        newStd = await db().sequelize.models.Person.findOne({
            where: {
                socialID: sid
            }
        })

        if (newStd === null) {
            
            await db().sequelize.models.Person.create({fullName: fullname, socialID: sid, address: address,
                 sex: sex, birthdate: birthdate, phonenumber: phonenumber })

            console.log(`${sid} before student.`)

            await db().sequelize.models.Student.create({socialID: sid, parentName: parentname, parentNumber: parentnumber});

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
