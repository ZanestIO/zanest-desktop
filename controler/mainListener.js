
const {cstd,ustd,dstd,rstd,getBulk} = require('./Channel/stdchannel/studentCh')
const {searchEvent} = require('./Channel/search/searchCh')
const {userChannel} = require('./Channel/userChannel/userCh')
const {load} = require('./Channel/session/loadCh')
const {sesRequest} = require('./Channel/session/reqUserSessionCh')
const {userAuth} = require('./Channel/userChannel/authCh')
const {logout} = require('./Channel/userChannel/logout')


module.exports = {
    userAuth,
    cstd,
    ustd,
    dstd,
    rstd,
    getBulk,
    searchEvent,
    userChannel,
    load,
    sesRequest,
    logout,
}