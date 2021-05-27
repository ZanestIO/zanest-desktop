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
            await Institution.create({name: 'Zanest', address: '', phoneNumber: ''});
        }
        
    }
    /**
     * updates some attributes
     * @param args (attributes)
     * @returns {Promise<*>}
     */
    static async update(args) {
        const updates = require('./update')
        return await updates(args.name, args.address, args.phoneNumber)
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

    static async setName(args) {
        const setter = require('./setName')
        return await setter(args)
    }

}

// ==================================================================================
// Institution DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
exports.institutionData = {
    attributes: {
        name: {
            type: DataTypes.STRING(30),
        },
        address: {
            type: DataTypes.STRING(30),
        },
        phoneNumber: {
            type: DataTypes.STRING(30)
        }
    },
    options: {
        "modelName": 'Institution'
    }
}


