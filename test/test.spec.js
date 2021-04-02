const {expect} = require('chai');
const db = require('./../models/Db')


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
// beforeEach(async function () {
//     await db().init();
// });

describe('testing models', () => {
    // beforeEach(()=> db.syncAndSeed());
    describe('user model', () => {
        args = {
            fullName: 'negin ahmadi', userName: 'negin',
            password: '123456789', userType: 'manager',
            birthDate: '1378/03/11', phoneNumber: '09185467825'
        }

        // console.log(db().sequelize.models)
        db().init()
        db().sequelize.models.User.add(args)
        describe('add new user to DB', () => {
            it('the username has been correctly saved', async () => {
                expect(db().sequelize.models.User.findOne({
                    where: {
                        userName: args.userName
                    }
                }))
            });

            it('the password has been correctly saved', async () => {
                expect(db().sequelize.models.User.findOne({
                    where: {
                        password: args.password
                    }
                }))
            });

        });

        describe('userTypeExist function', () => {
            it('manager exists in the DB ', async () => {
                expect(db().sequelize.models.User.findOne({
                    where: {
                        userType: 'manager'
                    }
                }))
            });

            it('admin exists in the DB ', async () => {
                expect(db().sequelize.models.User.findOne({
                    where: {
                        userType: 'admin'
                    }
                }))
            });
        });


    });
    describe('Student model', () => {
        it('student added ', async () => {

        });
    });
});
