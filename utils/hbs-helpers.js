const moment = require('moment')
module.exports.formatDate = function (date, format) {
  return moment(date).format('DD.MM.YYYY HH:mm');
}
module.exports.ternary = function(data, ifYes, ifNo){
  return data ? ifYes : ifNo
}