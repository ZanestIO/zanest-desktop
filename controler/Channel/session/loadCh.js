const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')

// ===================================================================================================
// load channel response
// ===================================================================================================
module.exports = {

    load: global.share.ipcMain.on('load', (e, args) => {
        // ==================================================================================
        // holds the last page for a reference
        let lastPage = {url: 'https://zanest.io', name: 'lastPage', value: "./renderer/" + args.currentPage + ".html"}

        global.share.session.defaultSession.cookies.set(lastPage)
        // TODO: if last page is page do nothing
        // let verify = true
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
                    console.log(value + " request for " + path)

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

                if (path !== "./renderer/404.html" ) {
                    //console.log(" start response Student ================================" + args.id)
                    if (args.id) {
                        //TODO: Type checking
                        // Convert to function
                        try {
                            const student = await db().sequelize.models.Student.show(args.id)

                            if (student[0]) {
                                console.log(student[1])
                                webContentsSend('getInfo', student[1])
                            } else {
                                console.log(student[1])
                                webContentsSend('errorNot', {
                                    title: "خطای بازیابی",
                                    message: "زبان آموز مورد نظر وجود ندارد"
                                })
                            }
                        } catch (err) {
                            console.log(err + "(( get Student Channel ))")
                        }
                    }
                }

            }).catch((error) => {
            console.log(error)
        })
    })
}