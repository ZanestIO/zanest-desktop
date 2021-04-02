const {expect} = require('chai');
const db = require('./../Db')


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
        args = {
            socialID: '3726847598', parentsName: 'hasan',
            parentNumber: '09372568749', fullname: 'ali akbari',
            sex: 'male', phonenumber: '09395781542',
            birthdate: '1360/08/15', address: 'baharan'
        }

        db().init()
        db().sequelize.models.Student.add(args)

        describe('add new student to DB', () => {
            it('the socialID has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        socialID: args.socialID
                    }
                }))
            });

            it('the parentsName has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        parentsName: args.parentsName
                    }
                }))
            });

            it('the parentNumber has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        parentNumber: args.parentNumber
                    }
                }))
            });

            it('the fullname has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        fullname: args.fullname
                    }
                }))
            });

            it('the sex has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        sex: args.sex
                    }
                }))
            });

            it('the phonenumber has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        phonenumber: args.phonenumber
                    }
                }))
            });

            it('the birthdate has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        birthdate: args.birthdate
                    }
                }))
            });

            it('the address has been correctly saved', async () => {
                expect(db().sequelize.models.Student.findOne({
                    where: {
                        address: args.address
                    }
                }))
            });

        });

        describe('')
    });
});
