
// if you have bcrypt errors while running tests,
// first uninstall, then reinstall it again

const { expect } = require('chai');
const db = require('./../Db')
// const student = require('../Student/Student')
// const person = require('../Person/Person')


describe('testing models', ()=>{
    // beforeEach(()=> db.syncAndSeed());
    describe('User model', ()=>{

        // confirm db connection is valid
        args = {
            fullName: 'negin ahmadi', userName: 'negin',
            password: '123456789', userType: 'manager',
            birthDate: '1378/11/03', phoneNumber: '09395824973'
        }

        // create user in db
        // db().sequelize.models.User.add(args)
        // let user = db().sequelize.models.User.add(args)

        describe('User model', ()=>{

            it('there are three users', async ()=>{
                // const users = await User.findAll();
                // expect(users.length).to.be.equal(3);
            });
        });
    });

    describe('Student model', ()=>{

        // confirm db connection is valid
        args = {
            socialID: 3784962763, parentsName: 'hassan', parentNumber: '09175643585',
            fullname: 'ali moradi', sex: 'male', phonenumber: '09375824851',
            birthdate:'1360/10/15', address: 'baharan'
        }

        // create student in the db
        // db().sequelize.models.Student.add(args)
        // student.add(args)
        it('student added ', async ()=> {

        });
    });
});


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

