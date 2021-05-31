// ==================================================================================
// utility functions to use
// ==================================================================================
const errors = require('./errors')
module.exports = {
    resetError(input) {
        input.err = false
        input.success = false
    },

    isEmpty(input) {
        if (input.value.length === 0) {
            input.err = true
            input.errMsg = errors.empty
            return true
        }
        return false
    },

    exact(input, num) {
        if (input.value.length !== num) {
            input.err = true
            input.errMsg = errors.exact(num)
            return true
        }
        return false
    },

    smallerThan(input, num) {
        if (input.value < num) {
            input.err = true
            input.errMsg = errors.min(num)
            return true
        }
        return false
    },

    biggerThan(input, num) {
        if (input.value > num) {
            input.err = true
            input.errMsg = errors.max(num)
            return true
        }
        return false
    },

    longerThan(input, num) {
        if (input.value.length < num) {
            input.err = true
            input.errMsg = errors.longer(num)
            return true
        }
        return false
    },

    shorterThan(input, num) {
        if (input.value.length > num) {
            input.err = true
            input.errMsg = errors.shorter(num+1)
            return true
        }
        return false
    },

    isNumber(input) {
        let numbers = new RegExp(/^\d+$/)
        if (!numbers.test(input.value)) {
            input.err = true
            input.errMsg = errors.onlyNum
            return true
        }
        return false
    },

    isLetter(input) {
        let numbers = new RegExp('[0-9]')
        let symbols = new RegExp('[-!#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

        if (numbers.test(input.value) || symbols.test(input.value)) {
            input.err = true
            input.errMsg = errors.onlyLetter
            return true
        }
        return false
    },
}
