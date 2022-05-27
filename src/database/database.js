const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite');
const databaseConfig = require('../config/database');

class Database {
    constructor() {
        console.log(databaseConfig)
        const app = initializeApp(databaseConfig);
        this.db = getFirestore(app);
    }
}

module.exports = new Database().db;