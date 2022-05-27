const { collection, getDocs, deleteDoc, doc, setDoc, query, where } = require('firebase/firestore/lite');
const { v4 } = require('uuid');

const db = require('../../database/database');

class GastoService {

    getExpenses() {
        return new Promise((resolve, reject) => {
            const initialDb = collection(db, 'gastos');
            getDocs(initialDb)
                .then(res => {
                    const expenses = res.docs.map(doc => doc.data());
                    resolve(expenses);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    newExpense(expense) {
        return new Promise((resolve, reject) => {
            setDoc(doc(db, 'gastos', v4()), expense)
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    deleteExpense(expenseId) {
        return new Promise((resolve, reject) => {
            const initialDb = collection(db, 'gastos');
            getDocs(query(initialDb, where("id", "==", expenseId)))
                .then(res => {
                    if (!res.docs.length > 0) {
                        reject({ 'statusCode': 204 });
                    }
                    res.docs.map(doc => {
                        deleteDoc(doc.ref)
                            .then(() => {
                                resolve(true);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    });
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    updateExpense(expenseId, expense) {
        return new Promise((resolve, reject) => {

            const initialDb = collection(db, 'gastos');
            getDocs(query(initialDb, where("id", "==", expenseId)))
                .then(res => {
                    if (!res.docs.length > 0) {
                        reject({ 'statusCode': 204 });
                    }

                    res.docs.map(d => {
                        setDoc(doc(db, 'gastos', expenseId), expense, { merge: true})
                            .then(() => {
                                resolve(expense);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    })
                })

        });
    }
}


module.exports = new GastoService();