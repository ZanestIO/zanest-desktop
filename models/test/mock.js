const db = require('./../Db')

async function testStudentCreation() {
// confirm db connection is valid
    args = {
        socialID: '3810', parentsName, parentNumber, fullname,
        sex, phonenumber, birthdate, address
    }

// create user in the db
    db().sequelize.models.Student.add(args)

// test if it has been done
    let student = await db().sequelize.models.Student.findOne({
        where: {
            sid: args.socialID
        }
    })}

// check if some user data is equal to our args data
//     student.dataValues.fullname === args.fullname