const {log} = require('./../../logger')

// ================================================================================
// RETURN INFO OF SOME TEACHER
// ================================================================================
module.exports = async (limit, offset) => {
    let info
    try {
        
        const db = require('./../Db');
        const {Person} = require('../Person/Person');
        
        // select * from teacher, person where socialID == sid
        info = await db().sequelize.models.Teacher.findAll({
            include: {
              model: Person
            },
            limit: limit,
            nest: false
        })

        return JSON.stringify(info);

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}
