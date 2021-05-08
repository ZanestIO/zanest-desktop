const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {User} = require('../../models/User/User');

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
// TESTING USER MODEL
// ===============================================================

describe("#UserModel", function () {

    // initialize user data
    const userData = {
        fullName: "negin ahmadi",
        userName: "negin",
        password: "123456789",
        userType: "manager",
        birthDate: 13991031,
        phoneNumber: "09182584878"
    }

    // ----------------------
    // testing add user
    // ----------------------
    describe("#add()", function () {

        it('should add new user to database', async function () {

            const stub = sinon.stub(User, "add").returns(userData);
            const result = await db().sequelize.models.User.add(userData);

            expect(stub.calledOnce).to.be.true;

            expect(result.fullName).to.equal(userData.fullName);
            expect(result.userName).to.equal(userData.userName);
            expect(result.password).to.equal(userData.password);
            expect(result.userType).to.equal(userData.userType);
            expect(result.birthDate).to.equal(userData.birthDate);
            expect(result.phoneNumber).to.equal(userData.phoneNumber);
            expect(result.createdAt).to.equal(userData.createdAt);
            expect(result.updatedAt).to.equal(userData.updatedAt);

        });
    });

    // ----------------------
    // testing show user
    // ----------------------
    describe("#show()", function () {

        it('should show the information of a user with given id', async function () {
            const stub = sinon.stub(User, "show").returns(userData);
            const result = await db().sequelize.models.User.show(userData.id);

            expect(stub.calledOnce).to.be.true;

            expect(result.fullName).to.equal(userData.fullName);
            expect(result.userName).to.equal(userData.userName);
            expect(result.password).to.equal(userData.password);
            expect(result.userType).to.equal(userData.userType);
            expect(result.birthDate).to.equal(userData.birthDate);
            expect(result.phoneNumber).to.equal(userData.phoneNumber);
        });
    });


    // ----------------------
    // testing update user
    // ----------------------
    describe("#updateStd()", function () {

        const newData = {
            fullName: "sara akbari",
            userName: "sara",
            password: "987654321",
            userType: "staff",
            birthDate: 13991031,
            phoneNumber: "09182584878"
        }

        it('should update some properties of user', async function () {
            const stub = sinon.stub(User, "update").returns(newData);
            const result = await db().sequelize.models.User.update(newData);

            expect(stub.calledOnce).to.be.true;

            expect(result.fullName).to.equal(newData.fullName);
            expect(result.userName).to.equal(newData.userName);
            expect(result.password).to.equal(newData.password);
            expect(result.userType).to.equal(newData.userType);
            expect(result.birthDate).to.equal(newData.birthDate);
            expect(result.phoneNumber).to.equal(newData.phoneNumber);
        });
    });


    // ------------------------
    // testing delete user
    // ------------------------
    describe("#delete()", function () {

        it('should delete the information of a user with given username', async function () {
            const stub = sinon.stub(User, "delete").returns(null);
            const result = await db().sequelize.models.User.delete(userData.userName);

            expect(stub.calledOnce).to.be.true;

            expect(result).equal(null);
            // expect(result).equal(undefined);
        });
    });
});
