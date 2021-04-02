const {DataTypes, Model, Deferrable} = require('sequelize')

// ==================================================================================
// 
// ==================================================================================
exports.Grade = class Grade extends Model {

    static async add(args) {
        const addGrade = require('./add')
        return await addGrade()
    }
}

// ==================================================================================
// 
// ==================================================================================
exports.GradeData = {
    attributes: {
        sid: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        value: {
            type: DataTypes.INTEGER,
            // allowNull is true by default
        },

        classID: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: Class,
                
                // this is the column name of the referenced model
                key: 'id',
                // With postgreSQL, it is optionally possible to declare when to check the foreign key constraint
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false
        },

        studentID: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: Student,
                
                // this is the column name of the referenced model
                key: 'id',

                deferrable: Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false,
        },

    },
    options: {
        "modelName": 'Grade'
    }
}