const { MongoClient } = require("mongodb");
class ExpenseService {
    uri = "<CONNECTION_URL>";

    async getExpenses() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db('my_money');
                const expensesDb = database.collection('expenses');
                const returnedExpenses = await expensesDb.find({});
                const expenses = await returnedExpenses.toArray();

                if (expenses.length > 0) {
                    resolve(expenses);
                } else {
                    reject('no expenses found');
                }

            } catch (err) {
                console.log(err);
                reject(err);
            } finally {
                await client.close();
            }
        });
    }

    async newExpense(expense) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db('my_money');
                const expensesDb = database.collection('expenses');
                await expensesDb.insertOne(expense);
                resolve('new expense created');
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }

    async deleteExpense(expenseId) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db('my_money');
                const expensesDb = database.collection('expenses');
                await expensesDb.deleteOne({ expense_id: expenseId });
                resolve('deleted expense');
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }

    async updateExpense(expenseId, expense) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db('my_money');
                const expensesDb = database.collection('expenses');
                const returnedExpenses = await expensesDb.findOne({ expense_id: expenseId });

                if (!returnedExpenses) {
                    reject('no expense found to update');
                }

                const updateExpense = { ...expense, expense_id: expenseId };

                await expensesDb.replaceOne({ expense_id: expenseId }, updateExpense);
                resolve('updated expense');
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }
}


module.exports = new ExpenseService();