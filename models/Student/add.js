const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
// creates the New Student
// ================================================================================
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
            
            await db().sequelize.models.Person.create({socialID: sid, fullName: fullname, phoneNumber: phonenumber, sex:sex, 
                birthDate: birthdate, address: address})

            await db().sequelize.models.Student.create({socialID: sid, parentName: parentname, parentnumber: parentnumber});
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

        console.log(err.msg)
        return [false, err.msg]
    }
}
