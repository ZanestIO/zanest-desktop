const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// TEACHER CLASS WITH METHODS
// ==================================================================================
exports.Teacher = class Teacher extends Model {

       /**
    * add teacher's object to DB
    * @param args (attributes)
    * @returns {Promise<*>}
    */
    static async add(args) {

       const addTeacher= require('./add')
       return await addTeacher(args.socialID, args.credit, args.degree, args.fullName,
            args.sex, args.phoneNumber, args.birthDate, args.address)
    }

    // update teacher info
    /**
     * updates some attributes for teacher
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {

        const updateTeacher = require('./update')
        return await updateTeacher(args.id, args.socialID, args.credit, args.degree, args.fullName,
            args.sex, args.phoneNumber, args.birthDate, args.address)
    }

    // delete teacher
    /**
     * delete teacher object from DB and archive
     * his/her personal info
     * @param sid (attributes)
     * @returns {Promise<*>}
     */
    static async delete(sid) {

        const deleteTeacher = require('./delete')
        return await deleteTeacher(sid)
    }
    
    // read teacher info
    static async show(args) {
        
        const readTeacher = require('./show')
        return await readTeacher(args)
    }

    // search teacher info
    static async search(searchBy, value) {
        
        const searchTeacher = require('./search')
        return await searchTeacher(searchBy, value)
    }

    static async getTeachers(limit, offset) {

        const searchTeacher = require('./get')
        return await searchTeacher(limit, offset)
    }

}

// ==================================================================================
// TEACHER DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define teacher's attributes
 * 
 */
exports.teacherData = {
    attributes: {
        socialID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },

        credit: {
            type: DataTypes.INTEGER,
            unique: true,
        },

        degree: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    options: {
        "modelName": 'Teacher'
    }
}
