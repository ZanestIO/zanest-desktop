const {DataTypes, Model} = require('sequelize')
const { Class } = require('../Class/Class')
const { Student } = require('../Student/Student')

// ==================================================================================
// Studnet Class CLASS WITH METHODS
// ==================================================================================
exports.StudentClass = class StudentClass extends Model {



}


// ==================================================================================
// DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define studnet class attributes
*/
exports.StudentClassData = {
    attributes: {
        sid: {
            type: DataTypes.INTEGER,
            refernces: {
                model: Student,
                key: 'id'
        },
        cid: {
            type: DataTypes.INTEGER,
            refernces: {
                model: Class,
                key: 'id'
            }
        }
        },
    },
    options: {
        "modelName": 'StudentClass'
    }
}