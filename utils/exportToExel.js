'use strict'
const Excel = require('exceljs')
const RegistrationForm = require('../models/registrationForm')
const hbsHelpers = require('../utils/hbs-helpers')



module.exports.export = async function() {
    let applications = await RegistrationForm.find({})

    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Debtors')
    worksheet.columns = [
        { header: 'Submitted at', key: 'createdAt' },
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'Country', key: 'country' },
        { header: 'Network name', key: 'networkName' },
        { header: 'Mobile', key: 'mobile' },
        { header: 'E-mail', key: 'email' },
        { header: 'Passport Number', key: 'passportNumber' },
        { header: 'Dietary Restrictions', key: 'dietaryRestrictions' },
        { header: 'Registration fee for CELA Kutaisi Reunion', key: 'feeKutaisi' },
        { header: 'Registration fee for CELA Svaneti Post-Reunion', key: 'feeSvaneti' },
        { header: 'Spouse/partner Full Name', key: 'aFullName' },
        { header: 'Spouse/partner Occupation/Company', key: 'aCompany' },
        { header: 'Spouse/partner E-mail', key: 'aEmail' },
        { header: 'Spouse/partner Phone Number', key: 'aPhone' },
        { header: 'Optional Activity', key: 'optionalActivity' },
        { header: 'COVID vaccinated?', key: 'covidVaccinated' },
        { header: 'COVID plan to get vaccinated?', key: 'covidDoVaccinate' },
        { header: 'Total Amount', key: 'totalAmount' },
    ]
    worksheet.columns.forEach(column => {
        column.width = column.header.length < 20 ? 20 : column.header.length
    })
    worksheet.getRow(1).font = { bold: true }


    applications.forEach((e, index) => {
        const rowIndex = index + 2
        worksheet.addRow({
            'createdAt': e.createdAt,
            'firstName': e.firstName,
            'lastName': e.lastName,
            'country': e.country,
            'networkName': e.networkName,
            'mobile': e.mobile,
            'email': e.email,
            'passportNumber': e.passportNumber,
            'dietaryRestrictions': e.dietaryRestrictions,
            'feeKutaisi': hbsHelpers.describeOption(e.feeKutaisi),
            'feeSvaneti': hbsHelpers.describeOption(e.feeSvaneti),
            'aFullName': e.aFullName,
            'aCompany': e.aCompany,
            'aEmail': e.aEmail,
            'aPhone': e.aPhone,
            'optionalActivity': e.optionalActivity,
            'covidVaccinated': e.covidVaccinated ? 'Yes' : 'No',
            'covidDoVaccinate': e.covidDoVaccinate ? 'Yes' : 'No',
            'totalAmount': hbsHelpers.totalFee(e.networkName, e.feeKutaisi, e.feeSvaneti, e.aFullName),
        })
    })
    const figureColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    figureColumns.forEach((i) => {
        worksheet.getColumn(i).alignment = { horizontal: 'center' }
    })

    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const insideColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S']
        insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
    })

    await workbook.xlsx.writeFile('./exports/2021 Reunion Registrations.xlsx')

}