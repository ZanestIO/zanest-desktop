const {DataTypes, Model, Deferrable} = require('sequelize')

// ==================================================================================
// STUDENT CLASS WITH METHODS
// ==================================================================================
exports.Student = class Student extends Model {

    static async add(args) {
        const addStudent = require('./add')
        // add student
        return await addStudent(args.socialId, args.parentsName, args.parentNumber, args.fullname,
             args.sex, args.phonenumber, args.birthdate, args.address)
    }
}


// ==================================================================================
// STUDENT DATA TO INITIALIZE THE CLASS IN DB 
// ==================================================================================
exports.userData = {
    attributes: {

        socialID: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: Person,
                
                // this is the column name of the referenced model
                key: 'socialID',
                // With postgreSQL, it is optionally possible to declare when to check the foreign key constraint
                //deferrable: Deferrable.INITIALLY_IMMEDIATE
            },
            
            allowNull: false,
            primaryKey: true,
        },

        parentsName: {
            type: DataTypes.STRING(50),
            // allowNull is true by default
        },

        parentNumber: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },


    },
    options: {
        "modelName": 'Student'
    }
}