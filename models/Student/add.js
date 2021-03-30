const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
// creates the New Student
// ================================================================================
module.exports = async (sid, parentname, parentnumber, fullname, sex, phonenumber, birthdate, address) => {
    let newStd
    try {
        // check if user exists
        newStd = await db().sequelize.models.Student.findOne({
            where: {
                socialID: sid
            }
        })

        if (newStd === null) {
            await db().sequelize.models.Student.create({socialID: sid, parentName: parentname, parentnumber: parentnumber});
            await db().sequelize.models.Person.create({socialID: sid, fullName: fullname, phoneNumber: phonenumber, sex:sex, 
                birthDate: birthdate, address: address})
            // logging and returning
            console.log(`${sid} created.`)
            return [true, "زبان اموز با موفقیت ایجاد شد"]

        } else {

            // logging and returning
            console.log(`can't create ${sid}`)
            return [false, "زبان اموز در سیستم موجود است"]
        }
        // =======================================
    } catch (err) {

        console.log(err.msg)
        return [false, err.msg]
    }
}
