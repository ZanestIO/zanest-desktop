const {DataTypes, Model} = require('sequelize')

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
        const updateStudent = require('./update')
        return await updateStudent(args.id, args.socialID, args.parentsName, args.parentNumber, args.fullName,
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
        const deleteStudent = require('./delete')
        return await deleteStudent(sid)
    }

    // read student info
    static async show(args) {
        const readStudent = require('./show')
        return await readStudent(args)
    }

    // search student info
    static async search(searchBy, value) {
        const searchStudent = require('./search')
        return await searchStudent(searchBy, value)
    }

    static async getStudents(limit, offset) {
        const getStudent = require('./get')
        return await getStudent(limit, offset)
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
