const moment = require('moment')
const fs = require('fs')
const path = require('path')

module.exports.formatDate = function(date, format) {
    return moment(date).format('DD.MM.YYYY HH:mm');
}
module.exports.ternary = function(data, ifYes, ifNo) {
    return data ? ifYes : ifNo
}
module.exports.totalFee = function(networkName, feeKutaisi, feeSvaneti, aFullName) {
    let qnty = 1
    let result = 0
    console.log(aFullName)
    if ((aFullName) && (aFullName.length > 0)) qnty += 1

    if (networkName == 'CELA' || networkName == 'MELA' || networkName == 'SEALA') {
        if (feeKutaisi == 'singleRoomKutaisi') result += 300
        if (feeSvaneti == 'singleRoomSvaneti') result += 300
        if (feeSvaneti == 'sharedRoomSvaneti') result += 270
    } else if (networkName == 'SIBF' || networkName == 'Non-member') {
        if (feeKutaisi == 'singleRoomKutaisi') result += 450
        if (feeSvaneti == 'singleRoomSvaneti') result += 450
        if (feeSvaneti == 'sharedRoomSvaneti') result += 420
    } else {
        result = 0;
    }
    result = result * qnty
    return `${result} USD (${qnty} person)`
}

module.exports.describeOption = function(slug) {
    let fees = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'fees.json'), { encoding: 'utf8', flag: 'r' }))
    let result = Object.assign({}, fees.feeKutaisi, fees.feeSvaneti)
    return result[slug]
}