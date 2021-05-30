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
        timeClassId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(11)
        },
        weekday: {
            type: DataTypes.STRING,
        },
    },
    options: {
        "modelName": 'TimeClass'
    }
}