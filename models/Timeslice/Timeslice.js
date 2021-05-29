const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// TimeSlice CLASS WITH METHODS
// ==================================================================================
exports.TimeSlice = class TimeSlice extends Model {

    /**
     * add object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const adds = require('./add')
        return await adds(args.startTime, args.finishTime)
    }

    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.id, args.startTime, args.finishTime)
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
     * show detail's 
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

    // get free Timeslice 
    static async pull(args) {
        const getFree = require('./getFreeTime')
        return await getFree(args.classRoomId)
    }

}

// ==================================================================================
// Timeslice DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define Timeslice's attributes
 * @type
 */
exports.timeSliceData = {
    attributes: {
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        finishTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    options: {
        "modelName": 'TimeSlice'
    }
}
