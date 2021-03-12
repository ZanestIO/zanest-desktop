// ================================================================================
// handles appending notifications and errors to the screen
// ================================================================================
exports.errorNot = (header, body, contactAdmin=false) => {
    let pageBody = document.querySelector('body')

    // ===================================================================================================
    // creating elements of notification
    let errorDiv = document.createElement('div')
    errorDiv.classList.add('notification', 'not-error')

    // close button
    let closeDiv = document.createElement('div')
    closeDiv.classList.add('not-close')
    closeDiv.innerHTML = '<i class="fa fa-times text-lg"></i>'

    // notification header
    let headerDiv = document.createElement('div')
    headerDiv.classList.add('not-header')
    headerDiv.innerText = header

    // notification body
    let bodyDiv = document.createElement('div')
    bodyDiv.classList.add('not-body')
    bodyDiv.innerText = body

    // notification footer
    let footerDiv = document.createElement('div')
    footerDiv.classList.add('not-footer')
    footerDiv.appendChild(document.createTextNode("لطفا پیغام خطای بالا را به پشتیبانی بفرستید."))

    // ===================================================================================================
    // assembling elements
    errorDiv.appendChild(closeDiv)
    errorDiv.appendChild(headerDiv)
    errorDiv.appendChild(bodyDiv)
    if (contactAdmin)
        errorDiv.appendChild(footerDiv)

    pageBody.append(errorDiv)

    // ===================================================================================================
    // adding close functionality
    closeDiv.addEventListener('click', e => {
        errorDiv.remove()
    })
}