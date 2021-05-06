module.exports = {
    empty: 'نمی تواند خالی باشد',
    notFound: "موردی جهت نمایش یافت نشد",
    error: "خطا رخداده است",
    incPassowrd: "رمز عبور وارد شده اشتباه است",
    reqLogin: "درخواست ورود به سیستم",
    
    successLogin(username) {
        return  `کاربر با شناسه ${username} وارد حساب کاربری خود شد.`
    },

    /**
    * status is boolean argument that determines message is succeeded or failed
    * cruds can be 'create', 'read' , 'update' , 'delete', 'search' determines kind of operation
    * sid Specify what the requested ID isr
     */
    request(cruds, status, sid=null) {
        switch(cruds) {
            case 'create':
                if(status) {
                    return `درخواست ایجاد ${sid} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست ایجاد ${sid} با خطا مواجه شد.`
                }
            case 'read':
                if(status) {
                    return `درخواست نمایش اطلاعات ${sid} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست نمایش اطلاعات ${sid} با خطا مواجه شد.`
                }
            case 'update':
                if(status) {
                    return `درخواست به روزرسانی اطلاعات ${sid} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست به روزرسانی اطلاعات ${sid} با خطا مواجه شد.`
                }
            case 'delete':
                if(status) {
                    return `درخواست حذف اطلاعات ${sid} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست حذف کردن اطلاعات ${sid} با خطا مواجه شد.`
                }
            case 'search':
                return `درخواست جستجوی اطلاعات ${sid}.`
        }
    },
    // show success and failed message
    show(status) {
        if(status) {
            return `درخواست با موفقیت انجام شد`
        } else {
            return `درخواست با خطا مواجه شد`
        }
    },
    // check that type is founded or not.
    check(status, sid=null) {
        if(status) {
            return ` اطلاعاتی با شناسه \'${sid}\' قبلا ثبت گردیده`
        } else if (status == false) {
            return `اطلاعاتی با شناسه \'${sid}\' موجود نیست `
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
        } else {
            if(status) {
                return `تایید هویت با موفقیت انجام شد`
            } else if(status === false) {
                return `تایید هویت با خطا مواجه شد`
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
