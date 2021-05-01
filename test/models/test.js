const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const Student = require('../../models/Student/Student');

describe("#Models", function () {

    let testdb;

    before(function (done) {
        db().init().then(function () {
            testdb = db()
        }).then(() => done())
    });

    after(function (done) {
        testdb.sequelize.drop().then(function () {
        }).then(done, done);
    });

    describe("#StudentModel", function () {

        // initialize student
        const studentData = {
            socialID: 3721584975,
            parentName: "ali",
            parentNumber: "09872342323",
            fullName: "negin ahmadi",
            sex: "female",
            phoneNumber: "09162342342",
            birthDate: 13991031,
            address: "sena"
        }

        describe("#addStd", function () {
            // db().init()

            it('should add new student to database', async function () {
                // console.log(db().models)
                // console.log(testdb)
                // const add = require('../../models/Student/add')
                const stub = sinon.stub(Student, "add").returns(studentData);
                const result = await db().sequelize.models.Student.add(studentData);

                expect(stub.calledOnce).to.be.true;


            });
        });
    });
});