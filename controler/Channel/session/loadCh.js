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

        if (args.page == args.currentPage) {
            return
        }

        let page = args.page

        // ==================================================================================
        // if user cookie is staff just allow to access the some limited page.
        global.share.session.defaultSession.cookies.get({url: 'http://zanest.io'})
            .then( async(cookies) => {
                // if cookies exist
                if (cookies) {
                    // get userType 
                    let type
                    cookies.forEach(node => {
                        if (node.name === 'userType') {
                            type = node.value
                        }
                    })

                    log.record('verbose', type + " request for " + page)

                    // limit accessibility of staff usertype
                    if (type === 'staff') {
                        switch (args.page) {
                            case "firstLogin":
                                page = "404"
                                break
                            case "userCreation":
                                page = "404"
                                break
                            case "user":
                                page = "404"
                                break
                        }
                    }
                } else {
                    page = "404"
                }

                let path = "./renderer/" + page + ".html"

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
            // request for who
            if (type === 'student') {
                try {
                    const student = await db().sequelize.models.Student.show(id)
                
                    if (student[0]) {
                        webContentsSend('getInfo', student[1])
                    } else {
                        log.record('info', message.check(false, id))
                        webContentsSend('errorNot', {
                            title: message.title('read', 'زبان آموز'),
                            message: student[1],
                            contactAdmin: true,
                        })
                    }
                } catch (err) {
                    log.record('error', err +":in:"+ __filename)
                }
            } else if (type === 'teacher'){
                try {
                    const teacher = await db().sequelize.models.Teacher.show(id)
                
                    if (teacher[0]) {
                        webContentsSend('getInfo', teacher[1])
                    } else {
                        log.record('info', message.check(false, id))
                        webContentsSend('errorNot', {
                            title: message.title('read', 'استاد'),
                            message: teacher[1],
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

