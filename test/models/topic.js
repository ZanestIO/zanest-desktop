const {expect} = require('chai');
const sinon = require("sinon");
const db = require('../../models/Db');
const {Topic} = require('../../models/Topic/Topic');

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
// TESTING TOPIC MODEL
// ===============================================================

describe("#TopicModel", function () {

    // initialize topic data
    const topicData = {
        name: "Family and friends 2",
        level: "elementary",
        length: 4,
        description: "this book takes 4 terms to finish",
    }


    // ----------------------
    // testing add topic
    // ----------------------

    describe("#add()", function () {

        it('should add new topic to database', async function () {

            const stub = sinon.stub(Topic, "add").returns(topicData);
            const result = await db().sequelize.models.Topic.add(topicData);

            expect(stub.calledOnce).to.be.true;

            expect(result.name).to.equal(topicData.name);
            expect(result.level).to.equal(topicData.level);
            expect(result.length).to.equal(topicData.length);
            expect(result.createdAt).to.equal(topicData.createdAt);
            expect(result.updatedAt).to.equal(topicData.updatedAt);

        });
    });


    // ----------------------
    // testing show topic
    // ----------------------

    describe("#show()", function () {

        it('should show the information of a topic with given id', async function () {
            const stub = sinon.stub(Topic, "show").returns(topicData);
            const result = await db().sequelize.models.Topic.show(topicData.id);

            expect(stub.calledOnce).to.be.true;

            expect(result.name).to.equal(topicData.name);
            expect(result.level).to.equal(topicData.level);
            expect(result.length).to.equal(topicData.length);
        });
    });



    // ----------------------
    // testing update topic
    // ----------------------
    describe("#update()", function () {

        const newData = {
            name: "504 essential words",
            level: "advanced",
            length: 5,
            description: "this book takes 5 terms to finish",
        }

        it('should update some properties of topic', async function () {
            const stub = sinon.stub(Topic, "update").returns(newData);
            const result = await db().sequelize.models.Topic.update(newData);

            expect(stub.calledOnce).to.be.true;

            expect(result.name).to.equal(newData.name);
            expect(result.level).to.equal(newData.level);
            expect(result.length).to.equal(newData.length);
            expect(result.createdAt).to.equal(newData.createdAt);
            expect(result.updatedAt).to.equal(newData.updatedAt);
        });
    });




    // ------------------------
    // testing delete student
    // ------------------------
    describe("#delete()", function () {

        it('should delete the information of a topic with given id', async function () {
            const stub = sinon.stub(Topic, "delete").returns(null);
            const result = await db().sequelize.models.Topic.delete(topicData.id);

            expect(stub.calledOnce).to.be.true;

            expect(result).equal(null);
        });
    });
});
