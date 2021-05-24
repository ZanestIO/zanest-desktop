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
    request(cruds, status, sid=null, name) {
        switch(cruds) {
            case 'create':
                if(status) {
                    return `درخواست ایجاد ${sid}:${name} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست ایجاد ${sid}:${name} با خطا مواجه شد.`
                }
            case 'read':
                if(status) {
                    return `درخواست نمایش اطلاعات ${sid}:${name} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست نمایش اطلاعات ${sid}:${name} با خطا مواجه شد.`
                }
            case 'update':
                if(status) {
                    return `درخواست به روزرسانی اطلاعات ${sid}:${name} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست به روزرسانی اطلاعات ${sid}:${name} با خطا مواجه شد.`
                }
            case 'delete':
                if(status) {
                    return `درخواست حذف اطلاعات ${sid}:${name} با موفقیت انجام شد.`
                } else if(status === false) {
                    return `درخواست حذف کردن اطلاعات ${sid}:${name} با خطا مواجه شد.`
                }
            case 'search':
                return `درخواست جستجوی اطلاعات ${sid}:${name}.`
        }
    },

    // show message to client
    show(status, crud, name) {
        if(status) {
            switch(crud){
                case 'create':
                    return `${name} اضافه شد`
                case 'read':
                    return `${name} نمایش داده شد`
                case 'update':
                    return ` به روزرسانی ${name} انجام شد`
                case 'delete':
                    return `${name} حذف گردید`
            }
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
    finishTimeError: 'تاریخ پایان باید از تاریخ شروع جلو تر باشد',
    conflictSemester: ' بازه زمانی انتخاب شده با ترم های دیگر تداخل دارد.',
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
