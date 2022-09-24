const { Router } = require('express');

const ExpenseController = require('./app/controllers/ExpenseController');
const ReportController = require('./app/controllers/ReportController');
const routes = new Router();

routes.get('/expenses', ExpenseController.index);
routes.post('/expenses', ExpenseController.store);
routes.put('/expenses?:id', ExpenseController.update);
routes.delete('/expenses?:id', ExpenseController.delete);

routes.get('/reports', ReportController.index);
routes.get('/reports?:year', ReportController.index);
routes.get('/reports?:year&:month', ReportController.index);

module.exports = routes;
