
const {cstd,ustd,dstd,rstd,getBulk} = require('./Channel/student/studentCh')
const {searchEvent} = require('./Channel/search/searchCh')
const {userChannel} = require('./Channel/user/userCh')
const {load} = require('./Channel/session/loadCh')
const {sesRequest} = require('./Channel/session/reqUserSessionCh')
const {userAuth} = require('./Channel/user/authCh')
const {logout} = require('./Channel/user/logoutCh')
const {pageCount} = require('./Channel/pagination/Counter')

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
    pageCount
}