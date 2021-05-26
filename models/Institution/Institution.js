const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// Institution CLASS WITH METHODS
// ==================================================================================
exports.Institution = class Institution extends Model {

    /**
     *  set defualt value for Institution  
     */
    static async createDefault() {
        let insInfo = await Institution.findOne({
            where: {
                id: 1
            }
        })
        if (insInfo === null) {
            await Institution.create({name: 'Zanest', address: 'default address', phone: 'default phone'});
        }
        
    }
    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.name, args.address, args.phone)
    }

    /**
     * show detail's 
     * @param {id} args 
     * @returns {promoise<object>} 
     */
    static async show() {
        const reads = require('./show')
        return await reads()
    }

}

// ==================================================================================
// Institution DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
/**
 * define Institution attributes
 * @type
 */
exports.institutionData = {
    attributes: {
        name: {
            type: DataTypes.STRING(50),
        },
        address: {
            type: DataTypes.STRING(50),
        },
        phoneNumber: {
            type: DataTypes.STRING(50)
        }
    },
    options: {
        "modelName": 'Institution'
    }
}


