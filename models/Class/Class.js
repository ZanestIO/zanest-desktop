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
        const adds = require('./add')
        return await adds(args.topicId, args.timeId, args.teacherId, args.classRoomId,
                            args.tuition, args.weekday, args.type)
    }

    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.id, args.topicId, args.timeId, args.teacherId, args.classRoomId,
                                args.tuition, args.weekday, args.type)
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
        return await reads(args.id)
    }

    // get all element
    static async get() {
        const gets = require('./get')
        return await gets()
    }

    
}

// ==================================================================================
// Class DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define Class's attributes
 * @type
 */
exports.classData = {
    attributes: {
        flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        semesterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            //defaultValue: // last id of semester 
        },
        teacherId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false
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