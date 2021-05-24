const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {Semester} = require('../../models/Semester/Semester');

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
// TESTING SEMESTER MODEL
// ===============================================================

describe("#SemesterModel", function () {

    // initialize topic data
    const semesterData = {
        year: "spring",
        startDate: 13991030,
        finishDate: 13991230,
    }


    // ----------------------
    // testing add semester
    // ----------------------

    describe("#add()", function () {

        it('should add new semester to database', async function () {

            const stub = sinon.stub(Semester, "add").returns(semesterData);
            const result = await db().sequelize.models.Semester.add(semesterData);

            expect(stub.calledOnce).to.be.true;

            expect(result.year).to.equal(semesterData.year);
            expect(result.startDate).to.equal(semesterData.startDate);
            expect(result.finishDate).to.equal(semesterData.finishDate);
            expect(result.createdAt).to.equal(semesterData.createdAt);
            expect(result.updatedAt).to.equal(semesterData.updatedAt);

        });
    });




    // ----------------------
    // testing show semester
    // ----------------------

    describe("#show()", function () {

        it('should show the information of a semester with given id', async function () {
            const stub = sinon.stub(Semester, "show").returns(semesterData);
            const result = await db().sequelize.models.Semester.show(semesterData.id);

            expect(stub.calledOnce).to.be.true;

            expect(result.year).to.equal(semesterData.year);
            expect(result.startDate).to.equal(semesterData.startDate);
            expect(result.finishDate).to.equal(semesterData.finishDate);

        });
    });





    // ----------------------
    // testing update semester
    // ----------------------

    describe("#update()", function () {

        const newData = {
            year: "fall",
            startDate: 14000101,
            finishDate: 14000331,
        }

        it('should update some properties of semester', async function () {
            const stub = sinon.stub(Semester, "update").returns(newData);
            const result = await db().sequelize.models.Semester.update(newData);

            expect(stub.calledOnce).to.be.true;

            expect(result.year).to.equal(newData.year);
            expect(result.startDate).to.equal(newData.startDate);
            expect(result.finishDate).to.equal(newData.finishDate);
            expect(result.createdAt).to.equal(newData.createdAt);
            expect(result.updatedAt).to.equal(newData.updatedAt);
        });
    });






    // ------------------------
    // testing delete student
    // ------------------------

    describe("#delete()", function () {

        it('should delete the information of a semester with given id', async function () {
            const stub = sinon.stub(Semester, "delete").returns(null);
            const result = await db().sequelize.models.Semester.delete(semesterData.id);

            expect(stub.calledOnce).to.be.true;

            expect(result).equal(null);
        });
    });
});
