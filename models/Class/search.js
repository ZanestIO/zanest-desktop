const db = require('../Db.js')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const { TimeSlice } = require('../Timeslice/Timeslice.js')
const { Topic } = require('../Topic/Topic.js')
const { Teacher } = require('../Teacher/Teacher.js')
const { TimeClass } = require('../Teacher/Teacher.js')
const {Op} = require('sequelize')
const { Person } = require('../Person/Person.js')
const sequelize = require('sequelize')
const {pWeekdays} = require('./../../renderer/js/utils/converts')
// ================================================================================
// RETURN INFO OF SOME CLASS
// ================================================================================
module.exports = async (searchBy, value) => {
    try {
        // 
        let info
        // select * from student, person where socialID == sid 
        if (searchBy === 'topic') {
            info = await db().sequelize.models.Class.findAll({
                where: {
                    "$Topic.name$": {
                        [Op.substring]: value
                    }
                },
                include: [
                    {
                        model : Topic,
                        required: false
                    },
                    {
                        model: TimeSlice,
                        required: false
                    }, 
                    {
                        model: Teacher,
                        include: {
                            model: Person
                        },
                        required: false
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                
            })
            
        } else if (searchBy === 'teacher') {
             info = await db().sequelize.models.Class.findAll({
                where: {
                    "$Teacher.Person.fullName$": {
                        [Op.substring]: value
                    }
                },
                include: [
                    {
                        model : Topic,
                        required: false
                    },
                    {
                        model: TimeSlice,
                        required: false
                    }, 
                    {
                        model: Teacher,
                        include: {
                            model: Person
                        },
                        required: false
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
            })
        }

        info = JSON.parse(JSON.stringify(info))
        let results = []
        
        if (info) {
            log.record('error', message.request('search', true, value,'class'))

            info.forEach(node => {
                holder = {
                    id: node.id,
                    topic: node.Topic.name,
                    teacher: node.Teacher.Person.fullName,
                    time: node.TimeSlice[0].startTime + '-' + node.TimeSlice[0].finishTime,
                    weekday: pWeekdays[node.TimeSlice[0].TimeClass.weekday]
                }
                results.push(holder)
            })
            return results

        } else {
            log.record('error', message.request('search',false, value, 'class'))
            return false
        }

        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
