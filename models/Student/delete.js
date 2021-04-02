

// ================================================================================
// delete a Student
// ================================================================================
/**
 * delete student object from DB,
 * but keep his/her personal info
 * @param sid
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (sid) => {
    let student
    try {
        // check student exist
        const db = require('../Db.js');
        student = await db().sequelize.models.Student.findOne({
            where: {
                socialID: sid
            }
        })

        if (student !== null) {
            
            await db().sequelize.models.Student.destroy({
                where: {
                    socialID: sid
                }
            });
            // 
            console.log(`${sid} deleted.`)
            return [true, "زبان اموز با موفقیت حذف شد"]

        } else {
            console.log(`User Does't Exist: ${sid}`)
            return [false, "زبان اموز مورد نظر در سیستم موجود نیست"]
        }
        // =======================================
    } catch (err) {
        console.log('exception')
        console.log(err.msg)
        return [false, err.msg]
    }
}
