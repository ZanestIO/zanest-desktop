const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const db = require('../Db.js');

// ================================================================================
// DELETE CLASS
// ================================================================================
/**
 * delete class room object from DB,
 * @param id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id) => {
    let cr
    try {
        // check Class exist
        course = await db().sequelize.models.Class.findOne({
            where: {
                id: id
            }
        })

        if (course !== null) {
            await db().sequelize.models.TimeClass.destroy({
                where: {
                    classId: id
                }
            });
            await db().sequelize.models.StudentClass.destroy({
                where: {
                    classId: id
                }
            })
            await db().sequelize.models.Class.destroy({
                where: {
                    id: id 
                }
            })
            //  
            const msg = message.request('delete', true, id, 'class')
            log.record('info', msg )

            return [true, message.show(true, 'delete', 'کلاس ')]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        if(err == "SequelizeForeignKeyConstraintError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
            return [false, 'کلاس با داده دیگری در ارتباط است']
        } else {
            return [false, err]
        }
    }
}
