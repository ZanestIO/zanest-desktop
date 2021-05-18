const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// SEMESTER CLASS WITH METHODS
// ==================================================================================
exports.Semester = class Semester extends Model {

    /**
     * add to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const adds = require('./add')
        return await adds(args.year, args.startDate, args.finishDate)
    }

    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.id, args.year, args.startDate, args.finishDate)
    }
    
    /**
     * delete from DB 
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async delete(id) {
        const deletes = require('./delete')
        return await deletes(id)
    }

    /**
     * show detail's 
     * @param {id} args 
     * @returns {promoise<object>} 
     */
    static async show(args) {
        const reads = require('./show')
        return await reads(args)
    }

    // get data
    static async get() {
        const gets = require('./get')
        return await gets()
    }

}

// ==================================================================================
//  SEMESTER DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define Semster's attributes
 * @type
 */
exports.SemesterData = {
    attributes: {
        flag: {
           type: DataTypes.BOOLEAN,
           allowNull: false,
           defaultValue: true
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finishDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    options: {
        "modelName": 'Semester'
    }
}