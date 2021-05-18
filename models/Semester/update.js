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

        // check new social id is not reserve for another person in the system
        if(semeseter.startDate != startDate || semester.finishDate != finishDate ) {
            check = await db().sequelize.models.Semester.findAll({
                where = {
                    [Op.or]: [{
                        startDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    }, {
                        finishDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    }]
                }
            })
        }

        // if update does't have any conflict then updated else return conflict message
        if(check === null){
            semester.update({year: year, startDate: startDate, finishDate: finishDate})

            const msg = message.request('update',true ,socialID, 'semester')
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

