const { format, parseISO } = require('date-fns');
const ptBr = require('date-fns/locale/pt-BR');

class ExpenseHelper {

    toGroup(expenses) {
        let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        let expensesList = [];
        let yearsList = [];
        let sortedMonths = [];
        let expensesSortedList = [];
        if (expenses) {
            expensesList = expenses.map(item => {
                yearsList.push(item.create_date);

                return {
                    id: item.expense_id,
                    nome: item.name,
                    categoria: item.category,
                    data_cadastro: item.create_date,
                    valor: item.value
                }
            });
            let listAllYears = yearsList.map(y => format(parseISO(y), 'yyyy'));
            let listAllYearsUniq = [...new Set(listAllYears)];

            listAllYearsUniq.sort((a, b) => a - b).reverse().forEach(y => {
                sortedMonths = [];
                months.forEach(m => {
                    expenses = [];
                    expensesList.forEach(e => {
                        let expenseMonth = format(parseISO(e.data_cadastro), 'MMMM', { locale: ptBr });
                        let expenseYear = format(parseISO(e.data_cadastro), 'yyyy');

                        if (m !== expenseMonth || y !== expenseYear) {
                            return;
                        }

                        expenses.push({
                            id: e.id,
                            name: e.nome,
                            category: e.categoria,
                            create_date: e.data_cadastro,
                            value: e.valor
                        });

                    })

                    if (expenses.length > 0) {
                        sortedMonths.push({
                            month: m,
                            expenses: expenses.sort((a, b) => new Date(a.create_date) - new Date(b.create_date)).reverse()
                        })
                    }
                })

                expensesSortedList = this.toGroupByYears(expensesSortedList, sortedMonths, y);

            });
        }

        return expensesSortedList;
    }

    toGroupByYears(callbackArray, monthList, year) {
        return [...callbackArray, {year: year, months: monthList}];
    }
}

module.exports = new ExpenseHelper();