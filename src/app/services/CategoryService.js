const { MongoClient } = require("mongodb");
require('dotenv').config();


class CategoryService {

    uri = process.env.URI_MONGODB;

    async getCategories(userId) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('categories');
                const returnedCategories = await expensesDb.find({ user_id: userId });
                const categories = await returnedCategories.toArray();

                resolve(categories);

            } catch (err) {
                reject(err);
            } finally {
                await client.close();
            }
        });
    }

    async newCategory(category) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('categories');
                await expensesDb.insertOne(category);
                resolve('new category created');
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }
}

module.exports = new CategoryService();