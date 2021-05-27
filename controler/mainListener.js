const {ctch, utch, dtch, rtch} = require('./Channel/teacher/teacherCh')
const {croom, uroom, droom, rroom} = require('./Channel/classRoom/classRoomCh')
const {csem, usem, dsem, rsem} = require('./Channel/semester/semesterCh')
const {ctime, utime, dtime,rtime} = require('./Channel/timeSlice/timeSliceCh')
const {cstd, ustd, dstd, rstd} = require('./Channel/student/studentCh')
const {searchEvent} = require('./Channel/search/searchCh')
const {uins, rins,setins} = require('./Channel/institution/institutionCh')
const {cuser ,duser ,uuser, ruser, muser, coloruser} = require('./Channel/user/userCh')
const {ctopic, dtopic,utopic,rtopic} = require('./Channel/Topic/topicCh')
const {load} = require('./Channel/session/loadCh')
const {reqUserSession, setMenuDocked, requestUserColor} = require('./Channel/session/reqUserSessionCh')
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
    // semester
    csem,
    usem,
    dsem,
    rsem,
    // timeSlice
    ctime,
    utime,
    dtime,
    rtime,
    // classRoom
    croom,
    uroom,
    droom,
    rroom,

    // institution
    uins,
    rins,
    setins,

    getBulk,
    searchEvent,
    // user
    userAuth,
    cuser ,duser ,uuser, ruser, muser, coloruser,
    // topic
    ctopic,
    dtopic,utopic,rtopic,
    //
    load,
    reqUserSession, setMenuDocked, requestUserColor,
    logout,
    pageCount
}