const db = require('../../../models/Db')
const {webContentsSend, setCookies} = require('../../../main')

// ===================================================================================================
// Create User
// ===================================================================================================
module.exports = {
    userChannel: global.share.ipcMain.on('userCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new user to db
            check = await db().sequelize.models.User.add(args)
            if (check[0]) {

                if (args.login === true) {
                    // login to Dashboard
                    setCookies(args)
                }
                verify = true

            } else {

                verify = false
                return webContentsSend('error', {
                    errorTitle: 'خطا در ایجاد حساب کاربری',
                    errorMessage: check[1],
                    contactAdmin: 'لطفا نام کاربری دیگری را امتحان کنید'
                })

            }
        } catch (err) {

            console.log(`Error occurred: ${err}`)
            verify = false
        }
        // send Response
        webContentsSend('responseUserCreation', verify)
    })
}
