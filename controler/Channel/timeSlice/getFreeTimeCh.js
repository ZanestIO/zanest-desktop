const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('../../../logger')

// ===================================================================================================
//  Get All Free Time Slice
// ===================================================================================================
module.gatime = {
    gatime: global.share.ipcMain.on('getAllFreeTimeSlice', async (E, args) => {
        try {
            const freeTime = await db().sequelize.models.TimeSlice.pull(args)
            webContentsSend('responseGetAllFreeTimeSlice', freeTime)
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}
