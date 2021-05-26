const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// CLASSROOM CLASS WITH METHODS
// ==================================================================================
exports.ClassRoom = class ClassRoom extends Model {

    /**
     * add object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const adds = require('./add')
        return await adds(args.name, args.capacity)
    }

    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.id, args.name, args.capacity)
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
// CLASS ROOM DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define Class Room attributes
 * @type
 */
exports.classRoomData = {
    attributes: {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        capacity: {
            type: DataTypes.INTEGER
        }
    },
    options: {
        "modelName": 'ClassRoom'
    }
}
