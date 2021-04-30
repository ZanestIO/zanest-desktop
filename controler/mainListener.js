const {ctch, utch, dtch, rtch} = require('./Channel/teacher/teacherCh')
const {cstd, ustd, dstd, rstd} = require('./Channel/student/studentCh')
const {searchEvent} = require('./Channel/search/searchCh')
const {cusr, dusr} = require('./Channel/user/userCh')
const {load} = require('./Channel/session/loadCh')
const {sesRequest} = require('./Channel/session/reqUserSessionCh')
const {userAuth} = require('./Channel/user/authCh')
const {logout} = require('./Channel/user/logoutCh')
const {pageCount} = require('./Channel/pagination/Counter')
const {getBulk} = require('./Channel/getBulk/getBulk')

module.exports = {
    // teacher
    ctch,
    utch,
    dtch,
    rtch,
    // student
    cstd,
    ustd,
    dstd,
    rstd,
    // 
    getBulk,
    searchEvent,
    // user
    userAuth,
    cusr,
    dusr,
    // 
    load,
    sesRequest,
    logout,
    pageCount
}