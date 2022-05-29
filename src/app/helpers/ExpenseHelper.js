const { format, parseISO } = require('date-fns');
const ptBr = require('date-fns/locale/pt-BR');

class ExpenseHelper {

    toGroupByMonths(expenses) {
        let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        let expensesList = [];
        let yearsList = [];
        let sortedMonths = [];
        let expensesSortedList = [];

        if (expenses) {
            expensesList = expenses.map(item => {
                yearsList.push(item.data_cadastro);

                return {
                    id: item.id,
                    nome: item.nome,
                    categoria: item.categoria,
                    data_cadastro: item.data_cadastro,
                    valor: item.valor
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
                            expenses
                        })
                    }
                })
                expensesSortedList.push({
                    year: y,
                    months: sortedMonths
                })

            });
        }

        return expensesSortedList;

    }
}

module.exports = new ExpenseHelper();