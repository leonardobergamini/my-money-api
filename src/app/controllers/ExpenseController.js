const ExpenseService = require('../services/ExpenseService');
const ExpenseHelper = require('../helpers/ExpenseHelper');
const { isFuture } = require('date-fns');
const { v4 } = require('uuid');


class ExpenseController {

    async index(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }
        ExpenseService.getExpenses(userId)
            .then(resp => {
                if (!resp.length) {
                    return res.status(404).json({ 'message': 'expenses not found' });
                }

                const expensesSortedList = ExpenseHelper.toGroup(resp);
                return res.status(200).json({ 'data': expensesSortedList });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() });
            })

    }

    async store(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }
        const requestBody = req.body;
        const requestExpenseCreateDate = new Date(parseInt(requestBody.data_cadastro.substring(6, 10)),
            parseInt(requestBody.data_cadastro.substring(3, 5) - 1),
            parseInt(requestBody.data_cadastro.substring(0, 2)));

        if (!requestBody) {
            return res.status(400).json({ 'message': 'no body request' });
        }

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(422).json({ 'message': 'creation date higher than current date' });
        }

        const expense = {
            user_id: userId,
            expense_id: v4(),
            name: requestBody.nome,
            category: requestBody.categoria,
            create_date: requestExpenseCreateDate.toISOString(),
            value: requestBody.valor
        }

        ExpenseService.newExpense(expense)
            .then(() => {
                return res.status(201).json({ 'message': 'expense created successfully' });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() });
            });
    }

    async delete(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }
        const expenseId = req.path.substring(10);

        if(!expenseId) {
            return res.status(400).json({ 'message': 'expense id is required' });
        }

        ExpenseService.deleteExpense(expenseId, userId)
            .then(resp => {
                if (resp) {
                    if (resp.length === 0) {
                        return res.status(404).json({ 'message': 'expense not found' });
                    }
                    return res.status(200).json({ 'message': 'expense deleted successfully' });
                }
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() });
            });
    }

    async update(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }
        const { body } = req;
        const expenseId = req.path.substring(10);
        const requestExpenseCreateDate = new Date(parseInt(body.data_cadastro.substring(6, 10)),
            parseInt(body.data_cadastro.substring(3, 5) - 1),
            parseInt(body.data_cadastro.substring(0, 2)));

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(400).json({ 'message': 'creation date higher than current date' });
        }

        const newBody = {
            name: body.nome,
            category: body.categoria,
            create_date: requestExpenseCreateDate.toISOString(),
            value: body.valor
        }


        ExpenseService.updateExpense(userId, expenseId, newBody)
            .then(() => {
                return res.status(200).json({ 'message': 'expense updated successfully' });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() });
            })
    }
}

module.exports = new ExpenseController();