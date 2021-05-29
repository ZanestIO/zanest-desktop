module.exports = {
    empty: 'نمی تواند خالی باشد',
    max(num) {
        return `بزرگتر از ${num}  مجاز نیست`
    },
    min(num) {
        return `کوچکتر از ${num}  مجاز نیست`
    },
    exact(num) {
        return ` ${num} رقم مجاز است.`
    },
    longer(num) {
        return `کمتر از ${num} کاراکتر مجاز نیست`
    },
    shorter(num) {
        return `بیشتر از ${num} کاراکتر مجاز نیست`
    },
    invalid: "کاراکتر غیرمجاز",
    onlyNum: 'فقط استفاده از اعداد مجاز',
    onlyLetter: 'فقط استفاده از حروف مجاز'
}