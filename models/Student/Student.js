const {DataTypes, Model, Deferrable} = require('sequelize')

// ==================================================================================
// STUDENT CLASS WITH METHODS
// ==================================================================================
exports.Student = class Student extends Model {


    // add new student
    static async add(args) {
        const addStudent = require('./add')
        return await addStudent(args.socialID, args.parentsName, args.parentNumber, args.fullname,
             args.sex, args.phonenumber, args.birthdate, args.address)
    }

    // update student info
    static async update(args) {
        const updateStudent = require('./update')

        return await updateStudent(args.socialID, args.parentsName, args.parentNumber, args.fullname,
            args.sex, args.phonenumber, args.birthdate, args.address )
    }
    
    // delete student
    static async delete(args) {
        const addStudent = require('./delete')
        return await addStudent(args.sid)
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