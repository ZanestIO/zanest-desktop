module.exports = {
    empty: 'نمی تواند خالی باشد',
    notFound: "موردی جهت نمایش یافت نشد",
    error: "خطا رخداده است",

    incUsername: "نام کاربری در سیستم موجود نیست", 
    incPassowrd: "رمز عبور واردشده اشتباه است",
    reqLogin: "درخواست ورود به سیستم",
    successLogin(username) {
        return  `کاربر با شناسه ${username} وارد حساب کاربری خود شد.`
    },
    // User
    reqUserCreationRequest: "درخواست ایجاد حساب کاربری جدید",
    reqCreateDefaultAdmin: "درخواست ایجاد حساب کاربری پیشرفض",
    reqUserTypeExists: "درخواست بررسی نام کاربری ",
    errUser: "خطا در ایجاد حساب کاربری",
    successUserAuth(username) {
        return `به حساب کاربری با شناسه ${username} مجوز ورود داده شد`
    },
    failUserAuth(username) {
        return `به حساب کاربری با شناسه ${username} مجوز ورود داده نشد`
    },

    // Student
    incStudent: "زبان آموز در سیستم موجود نیست",

    reqAddStudent: "درخواست ایجاد زبان اموز جدید",
    reqGetStudent: " درخواست نمایش جدول زبان اموزان",
    reqShowStudent: "درخواست نمایش اطلاعات دانشجویان",
    updateStudentInfo: "برای اطلاعات زبان اموزی به روزرسانی وجود نداشت",
    updatePersonInfo: "برای اطلاعات شخصی به روزرسانی وجود نداشت",
    errCreatestd: "خطا در ایجاد زبان اموز جدید",
    errUpdateStd: "خطا در به روزرسانی اطلاعات زبان اموز",
    errDeleteStd: "خطا در به حذف اطلاعات زبان اموز",

    availableStudent(sid) {
        return `زبان اموزی با شماره دانشجوی ${sid} موجود است`
    },
    reqUpdateStudent(sid) {
        return "("+sid +") درخواست به روزرسانی اطلاعات زبان اموز با شماره ملی"
    },
    reqDeleteStudent(sid) {
        return "("+sid +") درخواست حذف اطلاعات زبان اموز با شماره ملی"
    },

    reqSearchStudent(value) {
        return "("+value +") درخواست چستچوی اطلاعات زبان اموز "
    },

    searchStudent(value) {
        return "("+value +") چستچوی اطلاعات زبان اموز "
    },

    successUserCretion(username) {
        return  " ایجاد شد "+ username + " نام کاربری"
    },

    failSearch(value) {
        return `نتیجه جستجو : ${value}`
    },
    updateinfo(number, sid) {
        return `${number} رکورد از اطلاعات ${sid} به روز رسانی گردید`
    },
    successDeleteStudent(sid) {
        return `زبان اموز با شماره ملی ${sid} با موفقیت حذف گردید.`
    },
    successCreateStudent(sid) {
        return `زبان اموز با کد ملی ${sid} ایجاد گردید.`
    }
}
