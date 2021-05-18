'use strict'
const Excel = require('exceljs')
const ApplicationForm = require('../models/applicationForm')

module.exports.export = async function() {
  let applications = await ApplicationForm.find({})

  let workbook = new Excel.Workbook()
  let worksheet = workbook.addWorksheet('Debtors')
  worksheet.columns = [
    {header: 'Submitted at', key: 'createdAt'},
    {header: 'Full name', key: 'fullName'},
    {header: 'Network name', key: 'networkName'},
    {header: 'Network class year', key: 'networkClassYear'},
    {header: 'Country citizen', key: 'countryCitizen'},
    {header: 'Date of Birth', key: 'DoB'},
    {header: 'Current residense', key: 'currentResidence'},
    {header: 'Job title', key: 'title'},
    {header: 'Company name', key: 'companyName'},
    {header: 'Company Industry', key: 'companyIndustry'},
    {header: 'E-mail', key: 'email'},
    {header: 'Phone Number', key: 'phone'},
    {header: 'Please share your updated bio', key: 'bio'},
    {header: 'All sessions are conducted in English, so full fluency in English is critical. If English is not your native language, how would you describe your ability to communicate in English?', key: 'isEnglish'},
    {header: 'Please describe why you want to be a facilitator and why you think you would be an effective facilitator.', key: 'whyYouFacilitator'},
    {header: 'Please describe your previous facilitating/teaching/moderating/training experiences: (paid/non-paid). If any, please let us know when, with whom and the nature of your role', key: 'experienceInfo'},
    {header: 'If you have been a facilitator at one of the Network Academies, please tell us which class and who were your co-facilitators.', key: 'whoFacilitator'},
    {header: 'Please provide 2 references (with contact details) as to your ability to facilitate. If at all possible, make these references members of one of these affiliated networks.', key: 'references'},
    {header: 'If accepted to facilitate, are we authorized to use your photos and bio within our promotional materials?', key: 'authPhotos'}
  ]
  worksheet.columns.forEach(column => {
    column.width = column.header.length < 20 ? 20 : column.header.length
  })
  worksheet.getRow(1).font = {bold: true}


  applications.forEach((e, index) => {
    const rowIndex = index + 2
    worksheet.addRow({
      'createdAt': e.createdAt,
      'fullName': e.fullName,
      'networkName': e.networkName,
      'networkClassYear': e.networkClassYear,
      'countryCitizen': e.countryCitizen,
      'DoB': e.DoB,
      'currentResidence': e.currentResidence,
      'title': e.title,
      'companyName': e.companyName,
      'companyIndustry': e.companyIndustry,
      'email': e.email,
      'phone': e.phone,
      'bio': e.bio,
      'isEnglish': e.isEnglish,
      'whyYouFacilitator': e.whyYouFacilitator,
      'experienceInfo': e.experienceInfo,
      'whoFacilitator': e.whoFacilitator,
      'references': e.references,
      'authPhotos': e.authPhotos ? 'Yes' : 'No',
    })
  })
  const figureColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  figureColumns.forEach((i) => {
    worksheet.getColumn(i).alignment = {horizontal: 'center'}
  })

  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    worksheet.getCell(`A${rowNumber}`).border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }

    const insideColumns = ['A','B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O','P','Q','R','S']
    insideColumns.forEach((v) => {
      worksheet.getCell(`${v}${rowNumber}`).border = {
        top: {style: 'thin'},
        bottom: {style: 'thin'},
        left: {style: 'thin'},
        right: {style: 'thin'}
      }
    })
  })

  await workbook.xlsx.writeFile('./exports/CELA15 Facilitators Application Forms.xlsx')

}