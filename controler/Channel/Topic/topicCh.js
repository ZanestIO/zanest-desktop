const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// CREATE Topic
// ===================================================================================================
module.ctopic = {
    ctop: global.share.ipcMain.on('topicCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new topic to db
            check = await db().sequelize.models.Topic.add(args)
            if (check[0]) {
                verify = true
                webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                verify = false
                return webContentsSend('error', {
                    errorTitle: message.title('create','سرفصل'),
                    errorMessage: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseTopicCreation', verify)
    }),
}

// ===================================================================================================
// DELETE TOPIC 
// ===================================================================================================
module.dtopic = {
    dtop: global.share.ipcMain.on('topicDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.Topic.delete(args)
            if (check[0]) {
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'سرفصل'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'سرفصل'),
                message: err,
                contactAdmin: true
            })
        }
    }),
}

// ===================================================================================================
// UPDATEING TOPIC INFO
// ===================================================================================================
module.utopic = {
    utop: global.share.ipcMain.on('topicUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.Topic.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseTopicUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'سرفصل'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'سرفصل'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ TOPIC INFO
// ===================================================================================================
module.rtopic = {
    rtop: global.share.ipcMain.on('getTopicInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.Topic.show(args)
            if (check[0]) {
                return webContentsSend('responseGetTopicInfo', check[1])
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
