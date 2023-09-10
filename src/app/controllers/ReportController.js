const ExpenseService = require('../services/ExpenseService');
const ReportHelper = require('../helpers/ReportHelper');

class ReportController {

    async index(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }
        let expenses = await ExpenseService.getExpenses(userId);
        const { year, month } = req.query;

        if (expenses.length <= 0) {
            return res.status(404).json({ 'message': 'expenses not found' });
        }

        // Return all reports by selected year and month
        if (year && month) {
            expenses = ReportHelper.toGroupByFilters(expenses, year, month);

            if (expenses.length > 0) {
                return res.status(200).json({ 'data': expenses });
            }
            return res.status(404).json({ 'message': `no reports for '${month}' in '${year}'` });
        }

        // Return all reports by selected year
        if (year) {
            expenses = ReportHelper.toGroupByYear(expenses, year);

            if (expenses.length > 0) {
                return res.status(200).json({ 'data': expenses });
            }
            return res.status(404).json({ 'message': `no reports in '${year}'` });
        }

        // Return all reports
        expenses = ReportHelper.toGroup(expenses);
        if (expenses.length > 0) {
            return res.status(200).json({ 'data': expenses })
        }
        return res.status(404).json({ 'message': 'no reports' })
    }
}

module.exports = new ReportController();