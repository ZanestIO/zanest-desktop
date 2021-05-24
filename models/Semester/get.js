const {log} = require('./../../logger')
const db = require('./../Db');
// ================================================================================
// RETURN INFO Semester
// ================================================================================
module.exports = async () => {
    let info
    let semesters = []
    try {
        // select * from semester
        info = await db().sequelize.models.Semester.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts a info to a JSON format
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let semester = {
                id: node.id,
                year: node.year,
                startDate: node.startDate,
                finishDate: node.finishDate
            }
            semesters.push(semester)
        })

        return semesters

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}