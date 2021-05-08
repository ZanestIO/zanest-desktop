const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {Teacher} = require('../../models/Teacher/Teacher');

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
// TESTING TEACHER MODEL
// ===============================================================

describe("#TeacherModel", function () {

    // initialize teacher data
    const teacherData = {
        socialID: 3721584975,
        credit: 50,
        degree: "phd",
        fullName: "negin ahmadi",
        sex: "female",
        phoneNumber: "09162342342",
        birthDate: 13991031,
        address: "sena"
    }

    // ----------------------
    // testing add teacher
    // ----------------------
    describe("#addTch()", function () {

        it('should add new teacher to database', async function () {

            const stub = sinon.stub(Teacher, "add").returns(teacherData);
            const result = await db().sequelize.models.Teacher.add(teacherData);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(teacherData.socialID);
            expect(result.credit).to.equal(teacherData.credit);
            expect(result.degree).to.equal(teacherData.degree);
            expect(result.fullName).to.equal(teacherData.fullName);
            expect(result.sex).to.equal(teacherData.sex);
            expect(result.phoneNumber).to.equal(teacherData.phoneNumber);
            expect(result.birthDate).to.equal(teacherData.birthDate);
            expect(result.address).to.equal(teacherData.address);
            expect(result.createdAt).to.equal(teacherData.createdAt);
            expect(result.updatedAt).to.equal(teacherData.updatedAt);

        });
    });

    // ----------------------
    // testing show teacher
    // ----------------------
    describe("#showTch()", function () {

        it('should show the information of a teacher with given social id', async function () {
            const stub = sinon.stub(Teacher, "show").returns(teacherData);
            const result = await db().sequelize.models.Teacher.show(teacherData.socialID);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(teacherData.socialID);
            expect(result.credit).to.equal(teacherData.credit);
            expect(result.degree).to.equal(teacherData.degree);
            expect(result.fullName).to.equal(teacherData.fullName);
            expect(result.sex).to.equal(teacherData.sex);
            expect(result.phoneNumber).to.equal(teacherData.phoneNumber);
            expect(result.birthDate).to.equal(teacherData.birthDate);
            expect(result.address).to.equal(teacherData.address);
        });
    });


    // ----------------------
    // testing search teacher
    // ----------------------
    describe("#searchTch()", function () {

        const stub = sinon.stub(Teacher, "search").returns(teacherData);

        it('should return some of the teachers with given name', async function () {
            const result = await db().sequelize.models.Teacher.search('name', teacherData.fullName);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(teacherData.socialID);
            expect(result.credit).to.equal(teacherData.credit);
            expect(result.degree).to.equal(teacherData.degree);
            expect(result.fullName).to.equal(teacherData.fullName);
            expect(result.sex).to.equal(teacherData.sex);
            expect(result.phoneNumber).to.equal(teacherData.phoneNumber);
            expect(result.birthDate).to.equal(teacherData.birthDate);
            expect(result.address).to.equal(teacherData.address);
        });


        it('should return a teacher with given social id', async function () {
            const result = await db().sequelize.models.Teacher.search('id', teacherData.socialID);

            expect(stub.calledTwice).to.be.true;

            expect(result.socialID).to.equal(teacherData.socialID);
            expect(result.credit).to.equal(teacherData.credit);
            expect(result.degree).to.equal(teacherData.degree);
            expect(result.fullName).to.equal(teacherData.fullName);
            expect(result.sex).to.equal(teacherData.sex);
            expect(result.phoneNumber).to.equal(teacherData.phoneNumber);
            expect(result.birthDate).to.equal(teacherData.birthDate);
            expect(result.address).to.equal(teacherData.address);
        });
    });

    // ----------------------
    // testing update teacher
    // ----------------------
    describe("#updateTch()", function () {

        const newData = {
            oldSid: 3721584975,
            socialID: 3810571486,
            credit: 50,
            degree: "phd",
            fullName: "ali akbari",
            sex: "male",
            phoneNumber: "09162342342",
            birthDate: 13991031,
            address: "tabriz"
        }

        it('should update some properties of teacher', async function () {
            const stub = sinon.stub(Teacher, "updateTch").returns(newData);
            const result = await db().sequelize.models.Teacher.updateTch(newData);

            expect(stub.calledOnce).to.be.true;

            expect(result.socialID).to.equal(newData.socialID);
            expect(result.credit).to.equal(newData.credit);
            expect(result.degree).to.equal(newData.degree);
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
    // testing delete teacher
    // ------------------------
    describe("#deleteTch()", function () {

        it('should delete the information of a teacher with given social id, but archive personal information', async function () {
            const stub = sinon.stub(Teacher, "deleteTch").returns(null);
            const result = await db().sequelize.models.Teacher.deleteTch(teacherData.socialID);

            expect(stub.calledOnce).to.be.true;

            expect(result).equal(null);
            // expect(result).equal(undefined);
        });
    });
});
