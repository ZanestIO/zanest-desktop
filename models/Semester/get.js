const {log} = require('./../../logger')
const db = require('./../Db');
// ================================================================================
// RETURN INFO Semester
// ================================================================================
module.exports = async (id=null) => {
    let info
    let semesters = []
    try {
        // select * from semester
        if(id == null) {
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

        } else {
            // get name of 
            const currentSem = db().sequelize.models.Semester.findOne({
                where: {
                    id: id
                },
                nest: false
            })
            // converts a info to a JSON format
            const str = JSON.stringify(currentSem)
            const hold = JSON.parse(str)
            let result = []
            
            let semester = {
                id: hold.id,
                year: hold.year,
                startDate: hold.startDate,
                finishDate: hold.finishDate
            }

            result.push(semester)

            return result

        }
        
    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}