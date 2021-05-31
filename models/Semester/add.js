const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {Op} = require('sequelize')
// ================================================================================
// creates the New Semester
// ================================================================================
/**
 * creates a new semester
 * @param year
 * @param startDate
 * @param finishDate
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (year, startDate, finishDate) => {
    let noConflict
    try {
        let query = 'SELECT * FROM `Semesters`'
        let alreadySemesters = await db().sequelize.query(query)
        alreadySemesters = alreadySemesters[0]

        startDate = await checkFormat(startDate)
        finishDate = await checkFormat(finishDate)

        console.log(startDate + '>>>' + finishDate)

        noConflict = checkConflict(startDate, finishDate, alreadySemesters)
        // if start date greater then finish date return error message
        if (startDate >= finishDate) {
            const msg = message.request('create', false, startDate + "(:)" + finishDate, 'semester')
            log.record('info', msg)
            return [false, message.finishDateError]
        }

        // if new semester have no conflict create it else return conflict message
        if (noConflict == true) {
            let semester = await db().sequelize.models.Semester.create({year: year, startDate: startDate, finishDate: finishDate})

            const msg = message.request('create', true, semester.id, 'semester')
            log.record('info', msg)
            return [true, message.show(true, 'create', 'ترم تحصیلی')]

        } else {
            const msg = message.conflictSemester
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}

async function checkFormat(date) {
    let [year, month, day] = date.split('-')
    if(Number(month)< 9) {
        month = 0 + month
    }
    date = year+'-'+month+'-'+day

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