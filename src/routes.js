const { Router } = require('express');

const ExpenseController = require('./app/controllers/ExpenseController');
const routes = new Router();

routes.get('/expenses', ExpenseController.index);
routes.post('/expense', ExpenseController.store);
routes.put('/expense?:id', ExpenseController.update);
routes.delete('/expense?:id', ExpenseController.delete);

module.exports = routes;