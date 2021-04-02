// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (limit, offset) => {
    let info
    try {
//
        const db = require('./../Db');
        const {Person} = require('../Person/Person');

        // select * from student, person where socialID == sid
        info = await db().sequelize.models.Student.findAll({
            include: {
              model: Person
            },
            limit: 10,
            nest: false
        })

        return JSON.stringify(info);

    } catch(err) {
        console.log(err + "=================== try catch get ==============")
    }
}