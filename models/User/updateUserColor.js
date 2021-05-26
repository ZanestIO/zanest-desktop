const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')


module.exports = async (id, userColor) => {

    try {
        // count number of element that changed

        // find user with id
        let user = await db().sequelize.models.User.findOne({
            where: {
                id: id
            }
        })

        // if username doesn't already exist updated with new value
        if (user !== null){

            user.userColor = userColor;
            await user.save();
            const msg = message.request('update',true ,userColor, 'user')
            await log.record('info', msg)
            return [true]

        } else {
            // else show already exist message
            const msg = message.check(true, userColor)
            await log.record('info', msg)
            return [false, msg]
        }

    } catch (err) {
        await log.record('error', err)
        return [false, err]
    }
}