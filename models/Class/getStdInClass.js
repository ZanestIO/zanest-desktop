const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');

// ================================================================================
// ADD NEW CLASS
// ================================================================================
/**
 * add Student To Class
 * @param classId
 */
module.exports = async (classId) => {
    try {
        let query = "SELECT id, fullName, socialID FROM People INNER JOIN (" +
            "SELECT StudentId FROM StudentClasses WHERE ClassId = " + classId +
            ") ON id = StudentId"
        let res = await db().sequelize.query(query)
        res = res[0]

        // ==================================================================================
        // setting logs and return
        const msg = 'accessing all students for class with id of ' + classId
        log.record('info', msg)

        return [true, res]

    } catch (err) {
        log.record('error', err + ":in:" + __filename)
        return [false, err]
    }
}
