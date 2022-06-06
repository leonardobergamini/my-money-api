const ExpenseService = require('../services/ExpenseService');
const ReportHelper = require('../helpers/ReportHelper');

class ReportController {

    async index(req, res) {
        let expenses = await ExpenseService.getExpenses();
        const { year, month } = req.query;

        if (expenses.length <= 0) {
            return res.status(400).json({ 'message': 'expenses not found', 'status_code': 400 });
        }

        // Return all reports by selected year and month
        if (year && month) {
            expenses = ReportHelper.toGroupByFilters(expenses, year, month);

            if (expenses.length > 0) {
                return res.status(200).json({ 'data': expenses, 'status_code': 200 });
            }
            return res.status(400).json({ 'message': `no reports for '${month}' in '${year}'`, 'status_code': 400 });
        }

        // Return all reports by selected year
        if (year) {
            expenses = ReportHelper.toGroupByYear(expenses, year);

            if (expenses.length > 0) {
                return res.status(200).json({ 'data': expenses, 'status_code': 200 });
            }
            return res.status(400).json({ 'message': `no reports in '${year}'`, 'status_code': 400 });
        }

        // Return all reports
        expenses = ReportHelper.toGroup(expenses);
        if (expenses.length > 0) {
            return res.status(200).json({ 'data': expenses, 'status_code': 200 })
        }
        return res.status(400).json({ 'message': 'no reports', 'status_code': 400 })
    }
}

module.exports = new ReportController();