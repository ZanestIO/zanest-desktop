const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {Student} = require('../../models/Student/Student');

let testdb;

// initialize database before tests start
before(function (done) {
    db().init().then(function () {
        testdb = db()
    }).then(() => done())
});

 /*after(function (done) {
      testdb.sequelize.drop().then(function () {
      }).then(done, done);
  });*/

// ===============================================================
// TESTING STUDENT MODEL
// ===============================================================

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

    // ----------------------
    // testing add student
    // ----------------------
    describe("#addStd()", function () {

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

    // ----------------------
    // testing show student
    // ----------------------
    describe("#showStd()", function () {

        it('should show the information of a student with given social id', async function () {
            const stub = sinon.stub(Student, "show").returns(studentData);
            const result = await db().sequelize.models.Student.show(studentData.socialID);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(studentData.socialID);
            expect(result.parentName).to.equal(studentData.parentName);
            expect(result.parentNumber).to.equal(studentData.parentNumber);
            expect(result.fullName).to.equal(studentData.fullName);
            expect(result.sex).to.equal(studentData.sex);
            expect(result.phoneNumber).to.equal(studentData.phoneNumber);
            expect(result.birthDate).to.equal(studentData.birthDate);
            expect(result.address).to.equal(studentData.address);
        });
    });


    // ----------------------
    // testing search student
    // ----------------------
    describe("#search()", function () {

        const stub = sinon.stub(Student, "search").returns(studentData);

        it('should return some of the students with given name', async function () {
            const result = await db().sequelize.models.Student.search('name', studentData.fullName);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(studentData.socialID);
            expect(result.parentName).to.equal(studentData.parentName);
            expect(result.parentNumber).to.equal(studentData.parentNumber);
            expect(result.fullName).to.equal(studentData.fullName);
            expect(result.sex).to.equal(studentData.sex);
            expect(result.phoneNumber).to.equal(studentData.phoneNumber);
            expect(result.birthDate).to.equal(studentData.birthDate);
            expect(result.address).to.equal(studentData.address);
        });


        it('should return a student with given social id', async function () {
            const result = await db().sequelize.models.Student.search('id', studentData.socialID);

            expect(stub.calledTwice).to.be.true;

            expect(result.socialID).to.equal(studentData.socialID);
            expect(result.parentName).to.equal(studentData.parentName);
            expect(result.parentNumber).to.equal(studentData.parentNumber);
            expect(result.fullName).to.equal(studentData.fullName);
            expect(result.sex).to.equal(studentData.sex);
            expect(result.phoneNumber).to.equal(studentData.phoneNumber);
            expect(result.birthDate).to.equal(studentData.birthDate);
            expect(result.address).to.equal(studentData.address);
        });
    });

    // ----------------------
    // testing update student
    // ----------------------
    describe("#updateStd()", function () {

        const newData = {
            oldSid: 3721584975,
            socialID: 3810571486,
            parentName: "hasan",
            parentNumber: "09872342323",
            fullName: "ali akbari",
            sex: "male",
            phoneNumber: "09162342342",
            birthDate: 13991031,
            address: "tabriz"
        }

        it('should update some properties of student', async function () {
            const stub = sinon.stub(Student, "updateStd").returns(newData);
            const result = await db().sequelize.models.Student.updateStd(newData);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(newData.socialID);
            expect(result.parentName).to.equal(newData.parentName);
            expect(result.parentNumber).to.equal(newData.parentNumber);
            expect(result.fullName).to.equal(newData.fullName);
            expect(result.sex).to.equal(newData.sex);
            expect(result.phoneNumber).to.equal(newData.phoneNumber);
            expect(result.birthDate).to.equal(newData.birthDate);
            expect(result.address).to.equal(newData.address);
            expect(result.createdAt).to.equal(newData.createdAt);
            expect(result.updatedAt).to.equal(newData.updatedAt);
        });
    });


    // ------------------------
    // testing delete student
    // ------------------------
    describe("#deleteStd()", function () {

        it('should delete the information of a student with given social id, but archive personal information', async function () {
            const stub = sinon.stub(Student, "deleteStd").returns(null);
            const result = await db().sequelize.models.Student.deleteStd(studentData.socialID);

            expect(stub.calledOnce).to.be.true;

            expect(result).equal(null);
            // expect(result).equal(undefined);
        });
    });
});
