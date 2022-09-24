const { format, parseISO } = require('date-fns');
const ptBr = require('date-fns/locale/pt-BR');

class ReportHelper {
    months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    yearsList = [];

    toGroup(expenses) {
        let sortedMonths = [];
        let expensesSortedList = [];

        if (expenses) {
            expenses = this.toMapNewObject(expenses);
            let listAllYears = this.yearsList.map(y => format(parseISO(y), 'yyyy'));
            let listAllYearsUniq = [...new Set(listAllYears)];
            let categoryList = expenses.map(e => e.category)
            let categoryListUniq = [...new Set(categoryList)];

            listAllYearsUniq.sort((a, b) => a - b).reverse().forEach(y => {
                sortedMonths = [];
                this.months.forEach(m => {
                    let reports = [];
                    categoryListUniq.forEach(category => {
                        let totalValues = 0;
                        let expensesByCategory = expenses.filter(e => {
                            let expenseMonth = format(parseISO(e.create_date), 'MMMM', { locale: ptBr });
                            let expenseYear = format(parseISO(e.create_date), 'yyyy');

                            if (m !== expenseMonth || y !== expenseYear) {
                                return;
                            }

                            return e.category === category;
                        });

                        let totalValueByCategory = expensesByCategory.reduce((acc, currentValue) => {
                            return acc + currentValue.value
                        }, totalValues);

                        if (totalValueByCategory <= 0) {
                            return;
                        }

                        reports.push({
                            category: category,
                            value: totalValueByCategory
                        })
                    })

                    if (reports.length > 0) {
                        sortedMonths.push({
                            month: m,
                            reports,
                            total_expenses: this.toCalcTotalValueByMonth(reports)
                        })
                    }
                })

                if (sortedMonths.length > 0) {
                    expensesSortedList = [...expensesSortedList, { year: y, months: sortedMonths }];
                }

            });
        }
        return expensesSortedList;
    }

    toGroupByYear(expenses, year) {
        let expenseListMapped = [];
        let expensesFiltered = [];

        if (expenses) {
            expenseListMapped = this.toMapNewObject(expenses);

            expensesFiltered = expenseListMapped.filter(e => {
                let expenseYear = format(parseISO(e.create_date), 'yyyy');

                return expenseYear === year;
            })
        }

        return this.toGroup(expensesFiltered);
    }

    toGroupByFilters(expenses, year, month) {
        let expenseList = [];
        let expensesFiltered = [];
        let expensesFilteredByYear = [];

        if (expenses) {
            expenseList = this.toMapNewObject(expenses);

            expensesFilteredByYear = expenseList.filter(e => {
                let expenseYear = format(parseISO(e.create_date), 'yyyy');

                return expenseYear === year;
            });

            expensesFiltered = expensesFilteredByYear.filter(e => {
                let expenseMonth = format(parseISO(e.create_date), 'MMMM', { locale: ptBr });

                return expenseMonth === month;
            })
        }

        return this.toGroup(expensesFiltered);
    }

    toCalcTotalValueByMonth(reports) {
        let totalExpenses = 0;
        let totalExpensesByMonth = reports.reduce((acc, currentValue) => {
            return acc + currentValue.value
        }, totalExpenses);

        return totalExpensesByMonth;
    }

    toMapNewObject(expenses) {
        return expenses.map(item => {
            this.yearsList.push(item.create_date);

            return {
                id: item.expense_id,
                name: item.name,
                category: item.category,
                create_date: item.create_date,
                value: item.value
            }
        });
    }
}

module.exports = new ReportHelper();