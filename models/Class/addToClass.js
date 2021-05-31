const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// ADD NEW CLASS
// ================================================================================
/**
 * add Student To Class
 * @param studentId
 * @param classId
 */
module.exports = async (studentId, classId) => {
    try {

        let usr = await db().sequelize.models.Student.findOne({
            where: {
                socialID: studentId
            }
        })

        await db().sequelize.models.StudentClass.findOrCreate({
            where: {
                StudentId: usr.dataValues.id, ClassId: classId
            }
        })

        // ==================================================================================
        // setting logs and return
        const msg = 'زبان آموز به کلاس اضافه شد'
        log.record('info', msg)

        return [true, msg]

    } catch (err) {
        log.record('error', err + ":in:" + __filename)
        return [false, err]
    }
}
