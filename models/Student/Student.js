const {DataTypes, Model} = require('sequelize')
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ==================================================================================
// STUDENT CLASS WITH METHODS
// ==================================================================================
exports.Student = class Student extends Model {


    // add new student
    /**
     * add student's object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const msg = message.reqAddStudent
        log.record('debug', msg)

        const addStudent = require('./add')
        return await addStudent(args.socialID, args.parentsName, args.parentNumber, args.fullName,
             args.sex, args.phoneNumber, args.birthDate, args.address)
    }

    // update student info
    /**
     * updates some attributes for student
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async updateStd(args) {
        const msg = message.reqUpdateStudent(args.oldSid)
        log.record('debug', msg)

        const updateStudent = require('./update')
        return await updateStudent(args.oldSid, args.socialID, args.parentsName, args.parentNumber, args.fullName,
            args.sex, args.phoneNumber, args.birthDate, args.address )
    }
    
    // delete student
    /**
     * delete student object from DB and archive
     * his/her personal info
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async deleteStd(sid) {
        const msg = message.reqDeleteStudent(args.sid)
        log.record('debug', msg)

        const deleteStudent = require('./delete')
        return await deleteStudent(sid)
    }

    // read student info
    static async show(args) {
        log.record('debug', message.reqShowStudent)

        const readStudent = require('./show')
        // TODO: review this function
        return await readStudent(args)
    }

    // search student info
    static async search(searchBy, value) {
        const msg = message.reqSearchStudent(value)
        log.record('debug', msg)
        
        const searchStudent = require('./search')
        return await searchStudent(searchBy, value)
    }

    static async getStudents(limit, offset) {
        log.record('debug', message.reqGetStudent)

        const searchStudent = require('./get')
        return await searchStudent(limit, offset)
    }

}


// ==================================================================================
// STUDENT DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define student's attributes
 * @type {{options: {modelName: string}, attributes: {parentNumber: {allowNull: boolean, type: *}, socialID: {references: {model: (*|exports.Person), key: string}, allowNull: boolean, type: *, primaryKey: boolean}, parentsName: {type: *}}}}
 */
exports.studentData = {
    attributes: {

        socialID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },

        parentName: {
            type: DataTypes.STRING(50),
            // allowNull is true by default
        },

        parentNumber: {
            type: DataTypes.STRING(11),
            allowNull: false
        },

    },
    options: {
        "modelName": 'Student'
    }
}
