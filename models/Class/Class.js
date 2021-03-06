const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// Class Course WITH METHODS
// ==================================================================================
exports.Class = class Class extends Model {

    /**
     * add object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        let adds = require('./add')
        return await adds(args.topicId, args.teacherId, args.classRoomId,
                            args.tuition, args.type, args.timeSlices)
    }

    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.id, args.topicId, args.teacherId, args.classRoomId,
                                args.tuition, args.type, args.timeSlices)
    }
    
    /**
     * delete object from DB 
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async delete(args) {
        const deletes = require('./delete')
        return await deletes(args.id)
    }

    /**
     * show detail 
     * @param {id} args 
     * @returns {promoise<object>} 
     */
    static async show(args) {
        const reads = require('./show')
        return await reads(args)
    }

    // search student info
    static async search(searchBy, value) {
        const searchStudent = require('./search')
        return await searchStudent(searchBy, value)
    }

    // get all element
    static async get() {
        const gets = require('./get')
        return await gets()
    }

    static async addToClass(args) {
        const adds = require('./addToClass')
        return await adds(args.studentId, args.classId)
    }

    static async removeFromClass(args) {
        const removes = require('./removeFromClass')
        return await removes(args.studentId, args.classId)
    }

    static async getAllStds(args) {
        const getAll = require('./getStdInClass')
        return await getAll(args.classId)
    }

    
}

// ==================================================================================
// Class DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define Class's attributes
 */
exports.classData = {
    attributes: {
        flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        tuition: {
            type: DataTypes.STRING
            // allowNull
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false    
        },

    },
    options: {
        "modelName": 'Class'
    }
}