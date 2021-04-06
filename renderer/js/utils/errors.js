module.exports = {
    empty: 'نمی تواند خالی باشد',
    max(num) {
        return `نباید از ${num} بزرگتر باشد`
    },
    min(num) {
        return `نباید از ${num} کوچکتر باشد`
    },
    exact(num) {
        return `باید ${num} رقم باشد.`
    },
    invalid: "کاراکتر غیرمجاز",
    onlyNum: 'فقط استفاده از اعداد مجاز',
    onlyLetter: 'فقط استفاده از حروف مجاز'
}