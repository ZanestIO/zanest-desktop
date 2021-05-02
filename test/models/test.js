const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {Student} = require('../../models/Student/Student');

describe("#Models", function () {

    let testdb;

    before(function (done) {
        db().init().then(function () {
            testdb = db()
        }).then(() => done())
    });


    describe("#StudentModel", function () {

        // initialize student data
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

            it('should add new student to database', async function () {

                const stub = sinon.stub(Student, "add").returns(studentData);
                const result = await db().sequelize.models.Student.add(studentData);

                expect(stub.calledOnce).to.be.true;

                expect(result.socialID).to.equal(studentData.socialID);
                expect(result.parentName).to.equal(studentData.parentName);
                expect(result.parentNumber).to.equal(studentData.parentNumber);
                expect(result.fullName).to.equal(studentData.fullName);
                expect(result.sex).to.equal(studentData.sex);
                expect(result.phoneNumber).to.equal(studentData.phoneNumber);
                expect(result.birthDate).to.equal(studentData.birthDate);
                expect(result.address).to.equal(studentData.address);
                expect(result.createdAt).to.equal(studentData.createdAt);
                expect(result.updatedAt).to.equal(studentData.updatedAt);
            });
        });
    });
});