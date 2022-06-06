const ExpenseService = require('../services/ExpenseService');
const ExpenseHelper = require('../helpers/ExpenseHelper');
const { isFuture } = require('date-fns');
const { v4 } = require('uuid');


class ExpenseController {

    index(req, res) {
        ExpenseService.getExpenses()
            .then(resp => {
                if (!resp.length) {
                    return res.status(204).json({});
                }

                const expensesSortedList = ExpenseHelper.toGroup(resp);
                return res.status(200).json({ 'data': expensesSortedList, 'status_code': 200 });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString(), 'status_code': 500 });
            })

    }

    store(req, res) {
        const requestBody = req.body;
        const requestExpenseCreateDate = new Date(parseInt(requestBody.data_cadastro.substring(6, 10)),
            parseInt(requestBody.data_cadastro.substring(3, 5) - 1),
            parseInt(requestBody.data_cadastro.substring(0, 2)));

        if (!requestBody) {
            return res.status(400).json({ 'message': 'Sem body de request', 'status_code': 400 });
        }

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(400).json({ 'message': 'Data de cadastro superior a data atual', 'status_code': 400 });
        }

        const expense = {
            id: v4(),
            nome: requestBody.nome,
            categoria: requestBody.categoria,
            data_cadastro: requestExpenseCreateDate.toISOString(),
            valor: requestBody.valor
        }

        ExpenseService.newExpense(expense)
            .catch(err => {
                return res.status(500).json({ 'message': err.toString(), 'status_code': 500 });
            })
            .finally(() => {
                return res.status(200).json({ 'data': expense, 'status_code': 200 });
            });
    }

    delete(req, res) {
        const { id } = req.query;

        ExpenseService.deleteExpense(id)
            .then(resp => {
                if (resp) {
                    return res.status(200).json({ 'message': 'Gasto excluído com sucesso', 'status_code': 200 });
                }
            })
            .catch(err => {
                if (err.status_code === 204) {
                    return res.status(204).json({});
                }
                return res.status(500).json({ 'message': err.toString(), 'status_code': 500 });
            });
    }

    update(req, res) {
        const { body } = req;
        const { id } = req.query;
        const requestExpenseCreateDate = new Date(parseInt(body.data_cadastro.substring(6, 10)),
            parseInt(body.data_cadastro.substring(3, 5) - 1),
            parseInt(body.data_cadastro.substring(0, 2)));

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(400).json({ 'message': 'Data de cadastro superior a data atual', 'status_code': 400 });
        }

        const newBody = {
            nome: body.nome,
            categoria: body.categoria,
            data_cadastro: requestExpenseCreateDate.toISOString(),
            valor: body.valor
        }


        ExpenseService.updateExpense(id, newBody)
            .then(() => {
                return res.status(200).json({ 'data': newBody, 'status_code': 200 });
            })
            .catch(err => {
                if (err.status_code === 204) {
                    return res.status(204).json({});
                }
                return res.status(500).json({ 'message': err.toString(), 'status_code': 500 });
            })
    }
}

module.exports = new ExpenseController();