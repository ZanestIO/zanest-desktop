const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// load channel response
// ===================================================================================================
module.exports = {

    /* load channel args:
    *   currentPage: page that user currently in.
    *   page: page that requested to load
    *   id: if of user that requestd for load
    *   type: check type of user that request
    */
    load: global.share.ipcMain.on('load', (e, args) => {

        // ==================================================================================
        // holds the last page for a reference
        let lastPage = {url: 'https://zanest.io', name: 'lastPage', value: "./renderer/" + args.currentPage + ".html"}

        global.share.session.defaultSession.cookies.set(lastPage)

        // TODO: fix issue
        if (args.page == args.currentpage) {

            // return 
            console.log(lastPage.value+ " ------[issue]-------- " + args.page+":"+ __filename)
        } 

        let path = "./renderer/" + args.page + ".html"

        // ==================================================================================
        // if user cookie is staff just allow to access the some limited page.
        global.share.session.defaultSession.cookies.get({url: 'http://zanest.io'})
            .then( async(cookies) => {

                if (cookies) {
                    // get userType
                    let value
                    cookies.forEach(node => {
                        if (node.name === 'userType') {
                            value = node.value
                        }
                    })
                    log.record('verbose', value + " request for " + path)

                    if (value === 'staff') {
                        switch (args.page) {
                            case "firstLogin":
                                path = "./renderer/404.html"
                                break
                            case "createStudent":
                                path = "./renderer/404.html"
                                break
                        }
                    }

                } else {
                    path = "./renderer/404.html"
                }

                await setLoadFile(path)

                accessAuth(path, args.id, args.type)

            }).catch((err) => {
                log.record('error', err +":in:"+ __filename)
        })
    })
}

async function accessAuth(path, id, type) {
    if (path !== "./renderer/404.html" ) {
        // id most be available
        if (id) {
            // request from who
            if (type === 'student') {
                try {
                    const student = await db().sequelize.models.Student.show(id)
                
                    if (student[0]) {
                        webContentsSend('getInfo', student[1])
                    } else {
                        log.record('info', message.check('Student', false, id))
                        webContentsSend('errorNot', {
                            title: message.error,
                            message: message.incStudent,
                            contactAdmin: true,
                        })
                    }
                } catch (err) {
                    log.record('error', err +":in:"+ __filename)
                }
            }

        }
    }
}

