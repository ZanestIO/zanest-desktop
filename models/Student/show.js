const Model = require('sequelize');
const db = require('../Db.js');


// ================================================================================
// RETURN INFO OF SOME STUDENT
// ================================================================================
module.exports = async (sid) => {
    let student
    try {
        // 
        
        // select * from student, person where socialID == sid 
        const info = await db().sequelize.models.Student.findAll({
            include: [{
                model: Person,
                where: {
                    socialID: sid
                }
            }]
        }).toJSON() // convert to JSON

     
        if (info !== null) {

            console.log(`searched for ${sid}.`)
            return [true, info]
            // 

        } else {
            // 
            console.log(`${sid} not found`)
            return [false, '']
        }
        // =======================================
    } catch (err) {

        console.log(err.msg)
        return [false, err.msg]
    }
}
