const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const moment = require('jalali-moment');

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
        let noConflict = true

        // find semester with social ID 
        const semester = await db().sequelize.models.Semester.findOne({
            where: {
                id: id
            }
        })

        startDate = await checkFormat(startDate)
        finishDate = await checkFormat(finishDate)

        if (semester.startDate != startDate || semester.finishDate != finishDate){
            let query = 'SELECT * FROM `Semesters`'
            let alreadySemesters = await db().sequelize.query(query)
            alreadySemesters = alreadySemesters[0]

            noConflict = checkConflict(startDate, finishDate, alreadySemesters)
        }

        // if start date greater then finish date return error message
        if (startDate >= finishDate) {
            const msg = message.request('update', false, semester.id, 'semester')
            log.record('info', msg)
            return [false, message.finishDateError]
        }

        // if update does't have any conflict then updated else return conflict message
        if(noConflict == true){
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
        log.record('error', err +":in:"+ __filename)
        
        if (err == 'Error: Invalid Jalali year -100721') {
            return [false, message.incorrectDate]
        } else {
            return [false, err]
        }
    }
}

async function checkFormat(date) {
    let [year, month, day] = date.split('-')
    if(Number(month)< 9) {
        month = 0 + month
    }
    date = year +'-'+month+'-'+day
    date = moment.from(date, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD')
    return date
}

function checkConflict(startDate, finishDate, alreadySemesters){
    let flag = null
    let from = parseInt(startDate.split('-').join(""))
    let to = parseInt(finishDate.split('-').join(""))

    alreadySemesters.forEach( date => {
        const startDate = parseInt(date.startDate.split('-').join(""))
        const finishDate = parseInt(date.finishDate.split('-').join(""))

        if (startDate <= from && finishDate >= from || startDate <= to && finishDate >= to)
            flag = date.id
    })

    if (flag != null) {
        return false
    } else {
        return true
    }
}
