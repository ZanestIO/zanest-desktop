const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
// delete a Student
// ================================================================================
module.exports = async (sid) => {
    let student
    try {
        // check student exist
        student = await db().sequelize.models.Student.findOne({
            where: {
                socialID: sid
            }
        })

        if (student !== null) {
            
            await db().sequelize.models.Student.destroy({
                where: {
                    socialId: sid
                }
            });
            // 
            console.log(`${sid} deleted.`)
            return [true, "زبان اموز با موفقیت حذف شد"]

        } else {

            // 
            console.log(`User Does't Exist: ${sid}`)
            return [false, "زبان اموز مورد نظر در سیستم موجود نیست"]
        }
        // =======================================
    } catch (err) {

        console.log(err.msg)
        return [false, err.msg]
    }
}
