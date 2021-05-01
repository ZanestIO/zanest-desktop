const {expect} = require('chai');
const db = require('./../models/Db')
const {Student} = require('./../models/Student/Student');
const message = require('./../controler/massege');

describe('Users', function () {
    let testdb
    // Use your database here...
    // ISSUE: we don't have check value in models
    const data = {
        socialID: 8524231231,
        parentName: "ali",
        parentNumber: 09872342323,
        fullName: "eqbal",
        sex: "male",
        phoneNumber: 09162342342,
        birthDate: 13991031,
        address: "saqqez"
    }

    before(function (done) {
        db().init().then(function () {
            testdb = db()
        }).then(() => done())
    })

    after(function (done) {
        testdb.sequelize.drop().then(function () {
        }).then(done, done);
    });

    describe('#addStd()', function () {
        it('should save Student data to database', async function () {
            // create massage that expect have
            // const msg = message.request('create', data.fullName, true, data.socialID)

            result = await Student.add(data)
            expect(result).that.be.an('array').that.includes(true)
        });
    });

    describe('#deleteStd()', function () {
        it('should delete Student data from database', async function () {
            // const msg = message.request('delete', 'student', true, data.sid)

            result = await Student.deleteStd(data.socialID)
            expect(result).that.be.an('array').that.includes(true)

        });
    });

    describe('#search()', function () {
        it('should search Student data from database', async function () {
            // Use your database here
        })
    })
});