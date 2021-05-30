const {Sequelize} = require('sequelize')
const { Student, studentData } = require('./Student/Student')
const { Teacher, teacherData } = require('./Teacher/Teacher')
const { Person, personData } = require('./Person/Person')
const {Topic, topicData} = require('./Topic/Topic')
const {User, userData} = require('./User/User')
const {log} = require('./../logger')
const { Semester, SemesterData } = require('./Semester/Semester')
const { TimeSlice, timeSliceData } = require('./Timeslice/Timeslice')
const { ClassRoom, classRoomData } = require('./Classroom/Classroom')
const { Class , classData} = require('./Class/Class')
const { StudentClass, StudentClassData } = require('./StudentClass/StudentClass')
const { TimeClass, TimeClassData } = require('./TimeClass/TimeClass')
const { Institution, institutionData } = require('./Institution/Institution')


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
            TimeClass.init(TimeClassData.attributes, {sequelize: this.sequelize, modelName: TimeClassData.options.modelName})

            // Will add a PersonId attribute to Student to hold the primary key value for Person
            Student.belongsTo(Person, {
                foreignKey: 'PersonId'

            })

            Teacher.belongsTo(Person, {
                foreignKey: 'PersonId'
            })

           // Topic Relation
            Class.belongsTo(Topic, {
                foreignKey: 'topicId',
                onDelete: 'RESTRICT'
            })

            // ====================================================
            //  many to many relationship
            TimeSlice.belongsToMany(Class, {
                through: {
                    model: 'TimeClass',
                    unique: false
                },
                onDelete: 'RESTRICT',
            })
            Class.belongsToMany(TimeSlice, {
                through: {
                    model: 'TimeClass',
                    unique: false
                },
                onDelete: 'RESTRICT', // what happens when you delete time slice
            })
            // ====================================================

            // Class Room Assosiation
            Class.belongsTo(ClassRoom, {
                foreignKey: 'classRoomId',
                onDelete: 'RESTRICT'
            })

            // Semester Assosiation
            Class.belongsTo(Semester, {
                foreignKey: 'semesterId',
                onDelete: 'RESTRICT'
            })

            // Teacher Assosiation
            Class.belongsTo(Teacher, {
                foreignKey: 'teacherId',
                onDelete: 'RESTRICT'

            })

            // Student Assosiation
            Student.belongsToMany(Class, {
                through: 'StudentClass',

            })
            Class.belongsToMany(Student, {
                through: 'StudentClass',
                onDelete: 'RESTRICT',
            })

            // syncing db
            await this.sequelize.sync()

            // creating default admin if not exists
            // let person = await this.sequelize.models.Person.create({fullName: 'صهیب کهنه پوشی', socialID: '3810443355', address: 'مریوان',
            //     sex: 'male', birthDate: '1377/7/1', phoneNumber: '3810443355', personType: "std" })
            // await this.sequelize.models.Student.create({socialID: '3810443355', parentName: 'عابد', parentNumber: '09184545461', PersonId: person.id})
            //
            // let person1 = await this.sequelize.models.Person.create({fullName: 'ندا نادری', socialID: '3405891212', address: 'مریوان',
            //     sex: 'female', birthDate: '1377/7/1', phoneNumber: '09184578965', personType: "std" })
            // await this.sequelize.models.Student.create({socialID: '3405891212', parentName: 'عابد', parentNumber: '09184545461', PersonId: person1.id})
            //
            // let person2 = await this.sequelize.models.Person.create({fullName: 'مهسا کلوچه', socialID: '4875982413', address: 'مریوان',
            //     sex: 'female', birthDate: '1377/7/1', phoneNumber: '09187578541', personType: "std" })
            // await this.sequelize.models.Student.create({socialID: '4875982413', parentName: 'عابد', parentNumber: '09184545461', PersonId: person2.id})
            //
            // person = await this.sequelize.models.Person.create({fullName: 'روژین', socialID: '5465468794', address: 'مریوان',
            //     sex: 'female', birthDate: '1377/10/9', phoneNumber: '09188758796', personType: "tch" })
            // await this.sequelize.models.Teacher.create({socialID: '5465468794',
            //     degree: 'karshenasi', PersonId: person.id })
            //
            // person2 = await this.sequelize.models.Person.create({fullName: 'صادق', socialID: '3801213141', address: 'مریوان',
            //     sex: 'male', birthDate: '1377/1/2', phoneNumber: '09188758796', personType: "tch" })
            // await this.sequelize.models.Teacher.create({socialID: '3801213141',
            //     degree: 'karshenasi', PersonId: person2.id })
            //
            // let person3 = await this.sequelize.models.Person.create({fullName: 'اقبال', socialID: '2124578981', address: 'مریوان',
            //     sex: 'male', birthDate: '1377/10/9', phoneNumber: '09188758796', personType: "tch" })
            // await this.sequelize.models.Teacher.create({socialID: '2124578981',
            //     degree: 'kardani', PersonId: person3.id })
            //
            // await this.sequelize.models.Topic.create({name: 'Four Corners', level: 'elementary', length: '3', description: ''})
            // await this.sequelize.models.Topic.create({name: 'Top Notch', level: 'elementary', length: '3', description: ''})
            // await this.sequelize.models.Topic.create({name: 'Family And Friends', level: 'elementary', length: '3', description: ''})
            // await this.sequelize.models.Semester.create({year: '1400', startDate: '1400-01-01', finishDate: '1400-10-01'})
            // await this.sequelize.models.ClassRoom.create({name: 'A', capacity: '30'})
            // await this.sequelize.models.ClassRoom.create({name: 'B', capacity: '40'})
            // await this.sequelize.models.ClassRoom.create({name: 'C', capacity: '50'})
            // await this.sequelize.models.TimeSlice.create({startTime: '8:00', finishTime: '9:30'})
            // await this.sequelize.models.TimeSlice.create({startTime: '9:30', finishTime: '11:00'})
            // await this.sequelize.models.TimeSlice.create({startTime: '11:00', finishTime: '12:30'})
            // await this.sequelize.models.TimeSlice.create({startTime: '14:00', finishTime: '15:30'})
            // await this.sequelize.models.TimeSlice.create({startTime: '15:30', finishTime: '17:00'})
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