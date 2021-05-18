let haveErrors = false;
let sendBtn = UIkit.util.$('#sendBtn')
let chkAgreement = UIkit.util.$('#chkAgreement')
let applicationForm = UIkit.util.$('#applicationForm')
let congratsWindow = UIkit.util.$('#congratsWindow')

var DoB = new Pikaday({
  field: document.getElementById('DoB'),
  format: 'YYYY-MM-DD',
  toString(date, format) {
    // you should do formatting based on the passed format,
    // but we will just return 'D/M/YYYY' for simplicity
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  },
  parse(dateString, format) {
      // dateString is the result of `toString` method
      const parts = dateString.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
  }
});
DoB.setMinDate(new Date(1940,1))
DoB.setStartRange(new Date(1940,1))
DoB.setMaxDate(new Date(2015,1))
DoB.setEndRange(new Date(2015,1))
DoB.gotoDate(new Date(2000,1))

UIkit.util.on('#chkAgreement', 'click', function () {
  this.checked ? sendBtn.disabled = false : sendBtn.disabled = true
})

UIkit.util.on('#sendBtn', 'click', function (e) {
  e.preventDefault()
  if(validate() === false){
    let formData = document.getElementById("applicationFormData").elements;
    UIkit.util.ajax('/api/appForm',{
      method: 'POST',
      responseType: 'json',
      headers: {
        'Content-Type' : 'application/json; charset=UTF-8',
        'X-Requested-With' : 'XMLHttpRequest'
      },
      data: JSON.stringify({
        "fullName": formData["fullName"].value,
        "networkName": formData["networkName"].value,
        "networkClassYear": formData["networkClassYear"].value,
        "countryCitizen": formData["countryCitizen"].value,
        "DoB": formData["DoB"].value,
        "currentResidence": formData["currentResidence"].value,
        "title": formData["title"].value,
        "companyName": formData["companyName"].value,
        "companyIndustry": formData["companyIndustry"].value,
        "email": formData["email"].value,
        "phone": formData["phone"].value,
        "bio": formData["bio"].value,
        "isEnglish": formData["isEnglish"].value,
        "whyYouFacilitator": formData["whyYouFacilitator"].value,
        "experienceInfo": formData["experienceInfo"].value,
        "whoFacilitator": formData["whoFacilitator"].value,
        "references": formData["references"].value,
        "authPhotos": formData["authPhotos"].value,
        "_csrf": formData["_csrf"].value
      })
    }).then(function(xhr){
      sendBtn.disabled = true;
      sendBtn.value = 'SUBMITTING';
      if((typeof xhr.response.status != 'undefined') && (xhr.response.status === 'OK')){
        UIkit.util.addClass(applicationForm, 'uk-hidden')
        UIkit.util.removeClass(congratsWindow, 'uk-hidden')
      } else {
        console.log('errors here')
      }
    })
  } else {
    console.log('You have errors in your form')
    let errorBox = UIkit.util.$('#applicationErrorBox')
    UIkit.util.removeClass(errorBox, 'uk-hidden')

  }
  haveErrors = false
})

function isBad(element, reason) {
  haveErrors = true
  UIkit.util.removeClass(applicationErrorBox, 'uk-invisible')
  let badId = UIkit.util.$('#' + element.id + '_alert')
  if (badId === undefined) {
    UIkit.util.addClass(element, 'uk-form-danger')
    if (reason) {
      UIkit.util.after(element, `<span class="uk-text-small uk-text-danger" id="${element.id}_alert">${reason}</span>`)
    }
  }
}
console.log(haveErrors)
function isOk(element) {
  UIkit.util.removeClass(element, 'uk-form-danger')
  clearBad(element)
}
function clearBad(element) {
  let alertMsg = UIkit.util.$('#' + element.id + '_alert')
  UIkit.util.remove(alertMsg)
}
function isValidDate(dateString) {
    if(!/^\d{1,2}[.]\d{1,2}[.]\d{4}$/.test(dateString)) return false;
    let dateStringArr = dateString.split('.')
    if(Number(dateStringArr[0]) < 1 || Number(dateStringArr[0]) > 31) return false;
    if(Number(dateStringArr[1]) < 1 || Number(dateStringArr[1]) > 12) return false;
    if(Number(dateStringArr[2]) < 1940 || Number(dateStringArr[2]) > 2015) return false;
    return true;
};
function isValidTextArea(bioString, wordQnty = 500){
  if(bioString.value.length < 2) return false
  let bioWords = bioString.value.split(' ').length
  if(bioWords > wordQnty) return false
  return true
}
function validate() {
  const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let fullName = UIkit.util.$('#fullName')
  let networkName = UIkit.util.$('#networkName')
  let networkClassYear = UIkit.util.$('#networkClassYear')
  let countryCitizen = UIkit.util.$('#countryCitizen')
  let DoBCheck = UIkit.util.$('#DoB')
  let currentResidence = UIkit.util.$('#currentResidence')
  let title = UIkit.util.$('#title')
  let companyName = UIkit.util.$('#companyName')
  let companyIndustry = UIkit.util.$('#companyIndustry')
  let email = UIkit.util.$('#email')
  let phone = UIkit.util.$('#phone')
  let bio = UIkit.util.$('#bio')
  let isEnglish = UIkit.util.$('#isEnglish')
  let whyYouFacilitator = UIkit.util.$('#whyYouFacilitator')
  let experienceInfo = UIkit.util.$('#experienceInfo')
  let whoFacilitator = UIkit.util.$('#whoFacilitator')
  let references = UIkit.util.$('#references')

  fullName.value.length < 4 ? isBad(fullName, 'This field is less than 4 character. Please enter your Full name') : isOk(fullName)
  networkName.value == 'null' ? isBad(networkName, 'Please select network from list') : isOk(networkName)
  countryCitizen.value == 'null' ? isBad(countryCitizen, 'Please select country from list') : isOk(countryCitizen)
  networkClassYear.value == 'null' ? isBad(networkClassYear, 'Please select network class year') : isOk(networkClassYear)
  isValidDate(DoBCheck.value) != true ? isBad(DoBCheck, 'Enter valid Date of Birth. Format: dd.mm.yyyy') : isOk(DoBCheck)
  currentResidence.value.length < 4 ? isBad(currentResidence, 'This field is less than 4 character. Please enter your residence information') : isOk(currentResidence)
  title.value.length < 2 ? isBad(title, 'This field is less than 2 character. Please enter your title.') : isOk(title)
  companyName.value.length < 2 ? isBad(companyName, 'This field is less than 2 character. Please enter your Company Name.') : isOk(companyName)
  companyIndustry.value.length < 2 ? isBad(companyIndustry, 'This field is less than 2 character. Please enter your Company Industry.') : isOk(companyIndustry)
  emailRe.test(email.value) != true ? isBad(email, 'E-mail is invalid. Please enter a valid E-mail') : isOk(email)
  phone.value.length < 2 ? isBad(phone, 'Please enter your Phone number.') : isOk(phone)
  isValidTextArea(bio, 250) != true ? isBad(bio, `Bio information is incorrect. Current wordcount is ${(bio.value.split(' ').length) - 1}`) : isOk(bio)
  isValidTextArea(isEnglish) != true ? isBad(isEnglish, `Information which you are entered is incorrect. Max words is 500, Current wordcount is ${(isEnglish.value.split(' ').length) - 1}`) : isOk(isEnglish)
  isValidTextArea(whyYouFacilitator) != true ? isBad(whyYouFacilitator, `Information which you are entered is incorrect. Max words is 500, Current wordcount is ${(whyYouFacilitator.value.split(' ').length) - 1}`) : isOk(whyYouFacilitator)
  isValidTextArea(experienceInfo) != true ? isBad(experienceInfo, `Information which you are entered is incorrect. Max words is 500, Current wordcount is ${(experienceInfo.value.split(' ').length) - 1}`) : isOk(experienceInfo)
  isValidTextArea(whoFacilitator) != true ? isBad(whoFacilitator, `Information which you are entered is incorrect. Max words is 500, Current wordcount is ${(whoFacilitator.value.split(' ').length) - 1}`) : isOk(whoFacilitator)
  isValidTextArea(references) != true ? isBad(references, `Information which you are entered is incorrect. Max words is 500, Current wordcount is ${(references.value.split(' ').length) - 1}`) : isOk(references)

  if(haveErrors === false) return false;
  return true
}
UIkit.util.on('#fullName', 'keypress', function () {isOk(this)})
UIkit.util.on('#currentResidence', 'keypress', function () {isOk(this)})
UIkit.util.on('#title', 'keypress', function () {isOk(this)})
UIkit.util.on('#companyName', 'keypress', function () {isOk(this)})
UIkit.util.on('#companyIndustry', 'keypress', function () {isOk(this)})
UIkit.util.on('#DoB', 'click', function () {isOk(this)})
UIkit.util.on('#email', 'keypress', function () {isOk(this)})
UIkit.util.on('#phone', 'keypress', function () {isOk(this)})
UIkit.util.on('#bio', 'keypress', function () {isOk(this)})
UIkit.util.on('#isEnglish', 'keypress', function () {isOk(this)})
UIkit.util.on('#whyYouFacilitator', 'keypress', function () {isOk(this)})
UIkit.util.on('#experienceInfo', 'keypress', function () {isOk(this)})
UIkit.util.on('#whoFacilitator', 'keypress', function () {isOk(this)})
UIkit.util.on('#references', 'keypress', function () {isOk(this)})
UIkit.util.on('#networkName', 'click', function () {isOk(this)})
UIkit.util.on('#networkClassYear', 'click', function () {isOk(this)})
UIkit.util.on('#countryCitizen', 'click', function () {isOk(this)})
