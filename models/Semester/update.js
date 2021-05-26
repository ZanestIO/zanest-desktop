const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const {Op} = require('sequelize')

// ================================================================================
//  UPDATE SEMESTER INFO 
// ================================================================================
/**
 * update attributes
 * @param id
 * @param year
 * @param startDate
 * @param finishDate
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (id, year, startDate, finishDate) => {
    try {
        // count number of element that changed 
        let check = null

        // find semester with social ID 
        const semester = await db().sequelize.models.Semester.findOne({
            where: {
                id: id
            }
        })

        if (semester.startDate != startDate || semester.finishDate != finishDate){
            check = await db().sequelize.models.Semester.findAll({
                where: {
                    [Op.or]: [{
                        startDate: {
                            [Op.between]: [startDate, finishDate]
                        }
                    }, {
                        finishDate: {
                            [Op.between]: [startDate, finishDate]
                        }
                    }]
                }
            })
        }

        // if start date greater then finish date return error message
        if (startDate >= finishDate) {
            const msg = message.request('update', false, semester.id, 'semester')
            log.record('info', msg)
            return [false, message.finishDateError]
        }

        // if update does't have any conflict then updated else return conflict message
        if(check == null){
            semester.update({year: year, startDate: startDate, finishDate: finishDate})

            const msg = message.request('update',true ,id, 'semester')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'ترم تحصیلی')]
            
        } else {
            const msg = message.conflictSemester
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}

