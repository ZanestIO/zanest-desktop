const { expect } = require('chai');
var SequelizeMock = require('sequelize-mock');
const {User, userData} = require('../models/User/User')
// const {sequelize} = require('sequelize')
var dbMock = new SequelizeMock();

// const bcrypt = require('bcrypt')

// ==================================================================================
// DEFINING MOCK OBJECTS
// ==================================================================================

User.init(userData.attributes, {sequelize: dbMock, modelName: userData.options.modelName})


// Sequelize.prototype.import('../models/User/User.js')
// Sequelize.prototype.$overrideImport('../models/User/User.js', '../test/mock.js')
// Sequelize.prototype.import('../models/User/User.js')

/*beforeEach(async function() {
    await db.clear();
    await db.save([tobi, loki, jane]);
});*/

/*
describe('#User', function () {

    describe('userTypeExist', function () {

        it('manager exists in the DB', async () => {
            // const users = await db().sequelize.models.User.findOne({where:{userType: 'manager'}});
            let user = await userTypeExists('manager')
            // users.should.have.length(6);
            expect(user).to.be.equal(true)
        });

        it('input admin and returns false', async () => {
            let user = await userTypeExists('admin')
            expect(user).to.be.equal(false)
        });

        it('input null and returns false', async () => {
            let user = await userTypeExists('')
            expect(user).to.be.equal(false)
        });
    });


    describe('usernameExist', function () {
        it('true should be true')
    });
});
*/
describe('my app', ()=>{
    // beforeEach(()=> db.syncAndSeed());
   describe('data layer', ()=>{

       describe('User model', ()=>{

           it('there are three users', async ()=>{
               // const users = await User.findAll();
                // expect(users.length).to.be.equal(3);
           });
       });

       describe('Student model', ()=>{
           it('student added ', async ()=> {

           });
       });
   });
});
