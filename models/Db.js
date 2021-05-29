const {Sequelize} = require('sequelize')
const { Student, studentData } = require('./Student/Student')
const { Teacher, teacherData } = require('./Teacher/Teacher')
const { Person, personData } = require('./Person/Person')
const { Institution, institutionData } = require('./Institution/Institution')
const {Topic, topicData} = require('./Topic/Topic')
const {User, userData} = require('./User/User')
const {log} = require('./../logger')
const { Semester, SemesterData } = require('./Semester/Semester')
const { TimeSlice, timeSliceData } = require('./Timeslice/Timeslice')
const { ClassRoom, classRoomData } = require('./Classroom/Classroom')
const { Class , classData} = require('./Class/Class')
const { StudentClass, StudentClassData } = require('./StudentClass/StudentClass')

let database

// ==================================================================================
// SINGLETON CLASS FOR DATABASE
// ==================================================================================
class Db {
    // ==================================================================================
    // constructs the db and logs if there is error
    constructor() {
        try {
            this.sequelize = new Sequelize({
                dialect: "sqlite",
                storage: "./zanest.sqlite"
            })
        } catch (err) {
            let msg = "Database Creation Error =>" + err.message +':in:'+ __filename
            // for logging in the console
            log.record('error', msg )
        }
    }

    // ==================================================================================
    // authenticating the db with logging and info handling
    /**
     * a function to check if the database is connected
     * @returns {Promise<boolean|(boolean|string)[]>}
     */
    async authenticate() {
        // check if db connection is correct
        try {
            await this.sequelize.authenticate();
            return true
        } catch (error) {
            let msg = "Database Authentication Error =>" + error.message +':in:'+ __filename

            log.record('error', msg )
            return [false, msg]
        }
    }

    // ==================================================================================
    // initializing the database at start of application
    /**
     * initialize the database when the app starts
     * @returns {Promise<boolean>}
     */
    init = async () => {
        let ConnectionValid = this.authenticate();
        if (ConnectionValid) {

            User.init(userData.attributes, {sequelize: this.sequelize, modelName: userData.options.modelName})
            Class.init(classData.attributes,{sequelize: this.sequelize, modelName: classData.options.modelName})
            Institution.init(institutionData.attributes, {sequelize: this.sequelize, modelName: institutionData.options.modelName})
            Person.init(personData.attributes, {sequelize: this.sequelize, modelName: personData.options.modelName})
            Student.init(studentData.attributes, {sequelize: this.sequelize, modelName: studentData.options.modelName})
            Teacher.init(teacherData.attributes, {sequelize: this.sequelize, modelName: teacherData.options.modelName})
            Topic.init(topicData.attributes, {sequelize: this.sequelize, modelName: topicData.options.modelName})
            Semester.init(SemesterData.attributes, {sequelize: this.sequelize, modelName: SemesterData.options.modelName})
            TimeSlice.init(timeSliceData.attributes, {sequelize: this.sequelize, modelName: timeSliceData.options.modelName})
            ClassRoom.init(classRoomData.attributes,{sequelize: this.sequelize, modelName: classRoomData.options.modelName})
            StudentClass.init(StudentClassData.attributes, {sequelize: this.sequelize, modelName: StudentClassData.options.modelName})

            Student.belongsTo(Person, {
                foreignKey: 'PersonId'
            })

            Teacher.belongsTo(Person, {
                foreignKey: 'PersonId'
            })
           
            Topic.hasMany(Class, {
                foreignKey: 'topicId'
            });

            TimeSlice.hasMany(Class, {
                foreignKey: 'timeId'
            })

            ClassRoom.hasMany(Class, {
                foreignKey: 'ClassRoomId'
            })

            Semester.hasMany(Class, {
                foreignKey: 'semesterId'
            })

            Teacher.hasMany(Class, {
                foreignKey: 'teacherId'
            })
            // studnet class is juntion table
            Student.belongsToMany(Class, { through: StudentClass})

            // syncing db
            await this.sequelize.sync()

            // creating default admin if not exists
            await User.createDefaultAdmin()
            await Institution.createDefault()
            
            return true
        }
    }
}


// ==================================================================================
// WHAT WE ARE USING THROUGHOUT THE APPLICATION
// Database.getDB
/**
 * checks if DB has been created or not
 * @returns {Db|*}
 */
module.exports = function () {
    if (typeof database !== typeof new Db()) {
        database = new Db()
        return database
    } else {
        return database
    }
}