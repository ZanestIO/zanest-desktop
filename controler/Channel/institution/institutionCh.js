const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// UPDATEING INSTITUTION INFO
// ===================================================================================================
module.uins = {
    uins: global.share.ipcMain.on('institutionUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.Institution.update(args)

            if (check[0]) {
                // process successfully done
                //webContentsSend('responseInstitutionUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'اطلاعات اموزشگاه'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'اطلاعات آموزشگاه'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ Institution INFO
// ===================================================================================================
module.rins = {
    rins: global.share.ipcMain.on('getInstitutionInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.Institution.show()
            if (check[0]) {
                return webContentsSend('responseGetInstitutionInfo', check[1])
            } else {
                return webContentsSend('normalNot', {
                    title: '',
                    message: message.notFound,
                    contactAdmin: false,
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}
