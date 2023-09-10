const { MongoClient } = require("mongodb");
require('dotenv').config();

class ExpenseService {
    uri = process.env.URI_MONGODB;

    async getExpenses(userId) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('expenses');
                const returnedExpenses = await expensesDb.find({ user_id: userId });
                const expenses = await returnedExpenses.toArray();

                resolve(expenses);

            } catch (err) {
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
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
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

    async deleteExpense(expenseId, userId) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('expenses');
                const query = { user_id: userId, expense_id: expenseId };
                const { deletedCount } = await expensesDb.deleteOne(query);
                if (deletedCount === 0) {
                    resolve([]);
                    return;
                }
                resolve(deletedCount);
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }

    async updateExpense(userId, expenseId, expense) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('expenses');
                const returnedExpenses = await expensesDb.findOne({ expense_id: expenseId, user_id: userId });

                if (!returnedExpenses) {
                    reject('no expense found to update');
                }

                const updateExpense = { ...expense, expense_id: expenseId };

                await expensesDb.replaceOne({ expense_id: expenseId, user_id: userId }, updateExpense);
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