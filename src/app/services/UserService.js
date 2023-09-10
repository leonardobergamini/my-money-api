const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
require('dotenv').config();


class UserService {
    uri = process.env.URI_MONGODB;

    newUser(user) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('users');
                const userFound = await expensesDb.findOne({ email: user.email });

                if (userFound) {
                    reject('user email already used');
                    return;
                }

                const { insertedId } = await expensesDb.insertOne(user);
                resolve(insertedId);
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }

    findUser(userEmail, password) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(this.uri);
            try {
                const database = client.db(process.env.MONGODB_DATABASE_NAME);
                const expensesDb = database.collection('users');
                const userFound = await expensesDb.findOne({ email: userEmail });

                if (!userFound) {
                    reject('invalid user email or password');
                    return;
                }

                const isValidPassword = await bcrypt.compare(password, userFound.password_hash);

                if (!isValidPassword) {
                    reject('invalid user email or password');
                    return;
                }
                const { _id, name, email } = userFound;
                resolve({ id: _id.toString(), name, email });
            } catch (error) {
                reject(error);
            }
            finally {
                await client.close();
            }
        });
    }
}

module.exports = new UserService();