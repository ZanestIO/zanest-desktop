const { studentData } = require("../models/Student/Student")

module.exports = {
    empty: 'نمی تواند خالی باشد',
    notFound: "موردی جهت نمایش یافت نشد",
    error: "خطا رخداده است",
    incPassowrd: "رمز عبور واردشده اشتباه است",
    reqLogin: "درخواست ورود به سیستم",

    successLogin(username) {
        return  `کاربر با شناسه ${username} وارد حساب کاربری خود شد.`
    },

    /**
    * type can be Persian or English Name such as 'student' or 'teacher' or 'user' that determine request type is for who?
    * status is boolean argument that tell us that message kind is error or success and
    * cruds string argument that can be 'create', 'read' , 'update' , 'delete', 'search' 
    * also sid equal of Social id defualt of sid is null
     */
    request(cruds, type, status, sid=null) {
        switch(cruds) {
            case 'create':
                if(type !== null) {
                    if(status) {
                        return `درخواست ایجاد ${type}:${sid} با موفقیت انجام شد.`
                    } else if(status === false) {
                        return `درخواست ایجاد ${type}:${sid} با خطا مواجه شد.`
                    }
                }
            case 'read':
                if(type !== null) {
                    if(status) {
                        return `درخواست نمایش اطلاعات ${type}:${sid} با موفقیت انجام شد.`
                    } else if(status === false) {
                        return `درخواست نمایش اطلاعات ${type}:${sid} با خطا مواجه شد.`
                    }
                }
            case 'update':
                if(type !== null) {
                    if(status) {
                        return `درخواست به روزرسانی اطلاعات ${type}:${sid} با موفقیت انجام شد.`
                    } else if(status === false) {
                        return `درخواست به روزرسانی اطلاعات ${type}:${sid} با خطا مواجه شد.`
                    }
                }
            case 'delete':
                if(type !== null) {
                    if(status) {
                        return `درخواست حذف کردن اطلاعات ${type}:${sid} با موفقیت انجام شد.`
                    } else if(status === false) {
                        return `درخواست حذف کردن اطلاعات ${type}:${sid} با خطا مواجه شد.`
                    }
                }
            case 'search':
                if(type !== null) {
                        return `درخواست جستجوی اطلاعات ${type}:${sid}.`
                } else {
                    break
                }
        }
    },

    // check that type is founded or not.
    check(type, status, sid=null) {
        if(status) {
            if(type !== null) {
                return `${type}:${sid} مورد نظر در سیستم موجود است. `
            }
        } else if (status == false) {
            if(type !== null) {
                return `${type}:${sid} مورد نظر در سیستم موجود نیست. `
            }
        }

    },

    reqUserTypeExists: "درخواست بررسی  وضعیت نام کاربری ",

    // auth message
    auth(type, status) {
        if(type !== null) {
            if(status) {
                return `${type} تایید هویت با موفقیت انجام شد`
            } else if(status === false) {
                return `${type} تایید هویت با خطا مواجه شد`
            }
        }
    },

    // title message
    title(type, value) {
        switch(type) {
            case 'create':
                return `ایجاد ${value}`
            case 'delete':
                return `حذف ${value}`
            case 'update':
                return `به روزرسانی ${value}`
            case 'read':
                return `نمایش ${value}`
        }
    } 

}
