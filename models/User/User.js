const {DataTypes, Model} = require('sequelize')
const bcrypt = require('bcrypt')
// ==================================================================================
// USER CLASS WITH METHODS
// ==================================================================================
exports.User = class User extends Model {
    static async createDefaultAdmin() {
        let adminUser = await User.findOne({
            where: {
                userName: 'admin'
            }
        })
        if (adminUser === null) {
            let hashedPass = '323da#(df$#fald50..'
            bcrypt.hash(hashedPass, 10, async (err, hash) => {
                await User.create({fullName: 'zanest admin', userName: 'admin', password: hash, userType: 'admin'});
            })
        }
    }

    static async login(username, password) {
        const UserAuthenticator = require("./userAuth");
        return await UserAuthenticator.login(username, password)
    }

    static async userTypeExists(type) {
        const UserAuthenticator = require("./userAuth");
        return await UserAuthenticator.userTypeExists(type)
    }

    static async add(args) {
        const createUser = require('./add')
        return await createUser(args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    }
}


// ==================================================================================
// USER DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
exports.userData = {
    attributes: {
        fullName: {
            type: DataTypes.STRING,
            // allowNull is true by default
        },

        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        userType: {
            type: DataTypes.STRING,
            allowNull: false,
            default: 'staff'
        },

        birthDate: {
            type: DataTypes.DATEONLY
            // allowNull is true by defualt
        },

        phoneNumber: {
            type: DataTypes.INTEGER,
        }
    },
    options: {
        "modelName": 'User'
    }
}