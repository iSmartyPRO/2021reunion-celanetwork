const $u = UIkit.util
let haveErrors = false
let sendBtn = $u.$('#sendBtn')
let chkAgreement = $u.$('#chkAgreement')
let registrationForm = $u.$('#registrationForm')
let congratsWindow = $u.$('#congratsWindow')
let regFee = $u.$("#regFee")

$u.on('#chkAgreement', 'click', function() {
    this.checked ? sendBtn.disabled = false : sendBtn.disabled = true
})

$u.on('#sendBtn', 'click', function(e) {
    e.preventDefault()
    if (validate() === false) {
        let formData = document.getElementById("registrationFormData").elements;
        $u.ajax('/api/regForm', {
            method: 'POST',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: JSON.stringify({
                "firstName": formData["firstName"].value,
                "lastName": formData["lastName"].value,
                "country": formData["country"].value,
                "networkName": formData["networkName"].value,
                "mobile": formData["mobile"].value,
                "email": formData["email"].value,
                "passportNumber": formData["passportNumber"].value,
                "dietaryRestrictions": formData["dietaryRestrictions"].value,
                "feeKutaisi": formData["feeKutaisi"].value,
                "feeSvaneti": formData["feeSvaneti"].value,
                "aFullName": formData["aFullName"].value,
                "aCompany": formData["aCompany"].value,
                "aEmail": formData["aEmail"].value,
                "aPhone": formData["aPhone"].value,
                "covidVaccinated": formData["covidVaccinated"].value,
                "covidDoVaccinate": formData["covidDoVaccinate"].value,
                "optionalActivity": formData["optionalActivity"].value != "null" ? formData["optionalActivity"].value : null,
                "_csrf": formData["_csrf"].value
            })
        }).then(function(xhr) {
            sendBtn.disabled = true;
            sendBtn.value = 'SUBMITTING';
            if ((typeof xhr.response.status != 'undefined') && (xhr.response.status === 'OK')) {
                $u.addClass(registrationForm, 'uk-hidden')
                $u.removeClass(congratsWindow, 'uk-hidden')
            } else {
                console.log('errors here')
                console.log(xhr.response)
            }
        })
    } else {
        console.log('You have errors in your form')
        let errorBox = $u.$('#applicationErrorBox')
        $u.removeClass(errorBox, 'uk-hidden')

    }
    haveErrors = false
})

function isBad(element, reason) {
    haveErrors = true
    $u.removeClass(applicationErrorBox, 'uk-invisible')
    let badId = $u.$('#' + element.id + '_alert')
    if (badId === undefined) {
        $u.addClass(element, 'uk-form-danger')
        if (reason) {
            $u.after(element, `<span class="uk-text-small uk-text-danger" id="${element.id}_alert">${reason}</span>`)
        }
    }
}

function isOk(element) {
    $u.removeClass(element, 'uk-form-danger')
    clearBad(element)
}

function clearBad(element) {
    let alertMsg = $u.$('#' + element.id + '_alert')
    $u.remove(alertMsg)
}


function isValidTextArea(bioString, wordQnty = 500) {
    if (bioString.value.length < 2) return false
    let bioWords = bioString.value.split(' ').length
    if (bioWords > wordQnty) return false
    return true
}

function validate() {
    const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let firstName = $u.$('#firstName')
    let lastName = $u.$('#lastName')
    let country = $u.$('#country')
    let networkName = $u.$('#networkName')
    let mobile = $u.$('#mobile')
    let email = $u.$('#email')
    let passportNumber = $u.$('#passportNumber')
    let covidVaccinated = $u.$('#covidVaccinated')
    let covidDoVaccinate = $u.$('#covidDoVaccinate')
    let feeKutaisi = $u.$("#feeKutaisi")
    let feeSvaneti = $u.$("#feeSvaneti")

    firstName.value.length < 2 ? isBad(firstName, 'This field is less than 2 character. Please enter your First name') : isOk(firstName)
    lastName.value.length < 2 ? isBad(lastName, 'This field is less than 2 character. Please enter your Last name') : isOk(lastName)
    country.value == 'null' ? isBad(country, 'Please select country from list') : isOk(country)
    mobile.value.length < 2 ? isBad(mobile, 'Please enter your Mobile number.') : isOk(mobile)
    emailRe.test(email.value) != true ? isBad(email, 'E-mail is invalid. Please enter a valid E-mail') : isOk(email)
    passportNumber.value.length < 4 ? isBad(passportNumber, 'This field is less than 4 character. Please enter your passport number') : isOk(passportNumber)
    networkName.value == 'null' ? isBad(networkName, 'Please select network from list') : isOk(networkName)

    if (feeKutaisi.value == 'null' && feeSvaneti.value == 'null') {
        feeKutaisi.value == 'null' ? isBad(feeKutaisi, 'Please select your option') : isOk(feeKutaisi)
        feeSvaneti.value == 'null' ? isBad(feeSvaneti, 'Please select your option') : isOk(feeSvaneti)
    }

    covidVaccinated.value == 'null' ? isBad(covidVaccinated, 'Please select your COVID vaccination status') : isOk(covidVaccinated)
    if (covidVaccinated.value == 'no') {
        covidDoVaccinate.value == 'null' ? isBad(covidDoVaccinate, 'Please select your plan about COVID vaccination') : isOk(covidDoVaccinate)
    }
    if (haveErrors === false) return false;
    return true
}

function registrationFee() {
    let selnetwork = $u.$("#networkName").value
    let selKutaisi = $u.$("#feeKutaisi").value
    let selSvaneti = $u.$("#feeSvaneti").value
    let result = 0
    if (selnetwork == 'CELA' || selnetwork == 'MELA' || selnetwork == 'SEALA') {
        if (selKutaisi == 'singleRoomKutaisi') result += 300
        if (selSvaneti == 'singleRoomSvaneti') result += 300
        if (selSvaneti == 'sharedRoomSvaneti') result += 270
    } else if (selnetwork == 'SIBF' || selnetwork == 'Non-member') {
        if (selKutaisi == 'singleRoomKutaisi') result += 450
        if (selSvaneti == 'singleRoomSvaneti') result += 450
        if (selSvaneti == 'sharedRoomSvaneti') result += 420
    } else {
        result = 0;
    }
    result = result * participantsQnty()
    return result
}

function participantsQnty() {
    let qnty = 1
    if ($u.$("#aFullName").value.length > 0) qnty += 1
    return qnty
}

// Clear error in form for required fields
$u.on('#firstName', 'keypress', function() { isOk(this) })
$u.on('#lastName', 'keypress', function() { isOk(this) })
$u.on('#country', 'click', function() { isOk(this) })
$u.on('#networkName', 'click', function() { isOk(this) })
$u.on('#mobile', 'keypress', function() { isOk(this) })
$u.on('#email', 'keypress', function() { isOk(this) })
$u.on('#passportNumber', 'keypress', function() { isOk(this) })
$u.on('#feeKutaisi', 'click', function() { isOk(this) })
$u.on('#feeSvaneti', 'click', function() { isOk(this) })
$u.on('#covidVaccinated', 'click', function() { isOk(this) })

// If not vaccinated show additional question
$u.on('#covidVaccinated', 'change', function() {
    if (this.value === 'no') {
        $u.removeClass($u.$("#covidOption"), 'uk-hidden')
    } else {
        $u.addClass($u.$("#covidOption"), 'uk-hidden')
    }
})

// Show calculated registration fee bellow registration fee options
$u.on('#networkName', 'change', function() { regFee.innerHTML = `${registrationFee()} USD (${participantsQnty()} person)` })
$u.on('#feeKutaisi', 'change', function() { regFee.innerHTML = `${registrationFee()} USD (${participantsQnty()} person)` })
$u.on('#feeSvaneti', 'change', function() { regFee.innerHTML = `${registrationFee()} USD (${participantsQnty()} person)` })
$u.on('#aFullName', 'keyup', function() {
    regFee.innerHTML = `${registrationFee()} USD (${participantsQnty()} person)`
    if (participantsQnty() > 1) {
        $u.removeClass($u.$("#fieldACompany"), 'uk-hidden')
        $u.removeClass($u.$("#fieldAEmail"), 'uk-hidden')
        $u.removeClass($u.$("#fieldAPhone"), 'uk-hidden')
    } else {
        $u.addClass($u.$("#fieldACompany"), 'uk-hidden')
        $u.$("#aCompany").value = ''
        $u.addClass($u.$("#fieldAEmail"), 'uk-hidden')
        $u.$("#aEmail").value = ''
        $u.addClass($u.$("#fieldAPhone"), 'uk-hidden')
        $u.$("#aPhone").value = ''
    }
})