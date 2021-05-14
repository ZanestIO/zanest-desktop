const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// Topic CLASS WITH METHODS
// ==================================================================================
exports.Topic = class Topic extends Model {

    // add new Topic
    /**
     * add Topic's object to DB
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async add(args) {
        const addTop = require('./add')
        return await addTop(args.name, args.level, args.length, args.desc)
    }

    // update Topic info
    /**
     * updates some attributes for Topic
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updateTop = require('./update')
        return await updateTop(args.id, args.name, args.level, args.length, args.desc)
    }
    
    // delete Topic
    /**
     * delete Topic object from DB and archive
     * his/her personal info
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async delete(args) {
        const deleteTop = require('./delete')
        return await deleteTop(args.id)
    }

    // read topic info
    /**
     * show detail's of topic
     * @param {id} args 
     * @returns {promoise<object>} 
     */
    static async show(args) {
        const readTop = require('./show')
        return await readTop(args.id)
    }

    // get all topic
    static async get(limit, offset) {
        const getTop = require('./get')
        return await getTop(limit, offset)
    }

}


// ==================================================================================
// Topic DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define Topic's attributes
 * @type
 */
exports.topicData = {
    attributes: {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        level: {
            type: DataTypes.STRING(50),
            // allowNull is true by default
        },
        length: {
            type: DataTypes.INTEGER(2)
        },
        description: {
            type: DataTypes.STRING(255),
        },

    },
    options: {
        "modelName": 'Topic'
    }
}
