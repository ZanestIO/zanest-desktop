const {DataTypes, Model} = require('sequelize')

// ==================================================================================
// Time-Class CLASS WITH METHODS
// ==================================================================================
exports.TimeClass = class TimeClass extends Model {



}


// ==================================================================================
// DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
/**
 * define studnet class attributes
 */
exports.TimeClassData = {
    attributes: {
        weekday: {
            type: DataTypes.STRING,
        },
    },
    options: {
        "modelName": 'TimeClass'
    }
}