const ExpenseService = require('../services/ExpenseService')
const { format, parseISO, isFuture } = require('date-fns');
const ptBr = require('date-fns/locale/pt-BR');
const { v4 } = require('uuid');


class ExpenseController {

    index(req, res) {
        let month = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        let listYears = [];
        let expenses = [];
        let listExpenses = [];
        let monthsSorted = [];
        let listExpensesSorted = [];
        ExpenseService.getExpenses()
            .then(resp => {
                listExpenses = resp.map(item => {
                    listYears.push(item.data_cadastro);

                    return {
                        id: item.id,
                        nome: item.nome,
                        categoria: item.categoria,
                        data_cadastro: item.data_cadastro,
                        valor: item.valor
                    }
                });
                let listAllYears = listYears.map(y => format(parseISO(y), 'yyyy', { locale: ptBr }));
                let listAllYearsUniq = [...new Set(listAllYears)];
                listAllYearsUniq.sort((a, b) => a - b).reverse().forEach(y => {
                    monthsSorted = [];
                    month.forEach(m => {
                        expenses = [];
                        listExpenses.forEach(e => {
                            let expenseMonth = format(parseISO(e.data_cadastro), 'MMMM', { locale: ptBr });
                            let expenseYear = format(parseISO(e.data_cadastro), 'yyyy', { locale: ptBr });

                            if (m !== expenseMonth || y !== expenseYear) {
                                return;
                            }

                            expenses.push({
                                id: e.id,
                                name: e.nome,
                                category: e.categoria,
                                create_date: format(parseISO(e.data_cadastro), 'dd/MM/yyyy', { locale: ptBr }),
                                value: e.valor
                            });

                        })

                        if (expenses.length > 0) {
                            monthsSorted.push({
                                month: m,
                                expenses
                            })
                        }
                    })
                    listExpensesSorted.push({
                        year: y,
                        months: monthsSorted
                    })

                });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString(), 'statusCode': 500 });
            })
            .finally(() => {
                if (listExpensesSorted.length > 0) {
                    return res.status(200).json({ 'data': listExpensesSorted, 'statusCode': 200 });
                } else {
                    return res.status(204).json({});
                }
            });
    }

    store(req, res) {
        const requestBody = req.body;
        const requestExpenseCreateDate = new Date(parseInt(requestBody.data_cadastro.substring(6, 10)),
            parseInt(requestBody.data_cadastro.substring(3, 5) - 1),
            parseInt(requestBody.data_cadastro.substring(0, 2)));

        if (!requestBody) {
            return res.status(400).json({ 'message': 'Sem body de request', 'statusCode': 400 });
        }

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(400).json({ 'message': 'Data de cadastro superior a data atual', 'statusCode': 400 });
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
                return res.status(500).json({ 'message': err.toString(), 'statusCode': 500 });
            })
            .finally(() => {
                return res.status(200).json({ 'data': expense, 'statusCode': 200 });
            });
    }

    delete(req, res) {
        const { id } = req.query;

        ExpenseService.deleteExpense(id)
            .then(resp => {
                if (resp) {
                    return res.status(200).json({ 'message': 'Gasto excluído com sucesso', 'statusCode': 200 });
                }
            })
            .catch(err => {
                if (err.statusCode === 204) {
                    return res.status(204).json({});
                }
                return res.status(500).json({ 'message': err.toString(), 'statusCode': 500 });
            });
    }

    update(req, res) {
        const { body } = req;
        const { id } = req.query;
        const requestExpenseCreateDate = new Date(parseInt(body.data_cadastro.substring(6, 10)),
        parseInt(body.data_cadastro.substring(3, 5) - 1),
        parseInt(body.data_cadastro.substring(0, 2)));

        if (isFuture(requestExpenseCreateDate)) {
            return res.status(400).json({ 'message': 'Data de cadastro superior a data atual', 'statusCode': 400 });
        }

        const newBody = {
            nome: body.nome,
            categoria: body.categoria,
            data_cadastro: requestExpenseCreateDate.toISOString(),
            valor: body.valor
        }

        
        ExpenseService.updateExpense(id, newBody)
        .then(() => {
            return res.status(200).json({ 'data': newBody, 'statusCode': 200 });
        })
        .catch(err => {
            if (err.statusCode === 204) {
                return res.status(204).json({});
            }
            return res.status(500).json({ 'message': err.toString(), 'statusCode': 500 });
        })
    }
}

module.exports = new ExpenseController();