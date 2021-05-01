const {webContentsSend} = require('./../../../main')
const db = require('./../../../models/Db')
// ==================================================================================
// HANDLING COUNT OF PAGE THAT CURENTLY AVAILABLE
// ==================================================================================
module.exports = {
    /**
     * args: 
     *  limit: max number of element that each page have
     *  type: table that wanted
     */
    pageCount: global.share.ipcMain.on('pageCount', async(e, args) => {

        // 
        let total 
        if(args.type === 'student') {
            total = await db().sequelize.models.Student.count();
        } else if ( args.type === 'teacher') {
            total = await db().sequelize.models.Teacher.count();
        } else {
            total = 0
        }
        
        // total page = (total number of element in database / max number of element that each page want to show )
        result = ( total / args.limit ) 

        // Round a number upward to its nearest integer 
        if(isFloat(result))
            result = Math.ceil(result)

        console.log(result)
        // send result to Renderer
        webContentsSend('responcePageCount', { result: result })

    })
}

async function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

