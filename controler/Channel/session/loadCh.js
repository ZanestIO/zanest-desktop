const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
// ===================================================================================================
// load channel response
// ===================================================================================================
module.exports = {

    load: global.share.ipcMain.on('load', (e, args) => {
        // ==================================================================================
        // holds the last page for a reference
        let lastPage = {url: 'https://zanest.io', name: 'lastPage', value: "./renderer/" + args.currentPage + ".html"}

        global.share.session.defaultSession.cookies.set(lastPage)

        // TODO: why args.current page is undefined ? fix issue
        if (args.currentPage == args.lastPage) {

            // return 
            console.log(lastPage.value+ " -------------- " + args.page)
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
                    log.record('info', value + " request for " + path)

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

                accessAuth(path, args.id)

            }).catch((err) => {
                log.record('error', err +":in:"+ __filename)
        })
    })
}

async function accessAuth(path, id) {
    if (path !== "./renderer/404.html" ) {
        if (id) {
            //TODO: Type checking
            try {
                const student = await db().sequelize.models.Student.show(id)
    
                if (student[0]) {
                    log.record('info', message.reqGetInfo(id))
                    webContentsSend('getInfo', student[1])
                } else {
                    log.record('error', message.incStudent)
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

