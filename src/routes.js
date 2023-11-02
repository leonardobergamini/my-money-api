const { Router } = require('express');

const ExpenseController = require('./app/controllers/ExpenseController');
const ReportController = require('./app/controllers/ReportController');
const UserController = require('./app/controllers/UserController');
const LoginController = require('./app/controllers/LoginController');
const CategoryController = require('./app/controllers/CategoryController');
const AuthMiddleware = require('./app/middlewares/Authentication');
const routes = new Router();

routes.get('/expenses', AuthMiddleware, ExpenseController.index);
routes.post('/expenses', AuthMiddleware, ExpenseController.store);
routes.put('/expenses/:id', AuthMiddleware, ExpenseController.update);
routes.delete('/expenses/:id', AuthMiddleware, ExpenseController.delete);

routes.get('/reports', AuthMiddleware, ReportController.index);
routes.get('/reports?:year', AuthMiddleware, ReportController.index);
routes.get('/reports?:year&:month', AuthMiddleware, ReportController.index);

routes.post('/users', UserController.store);

routes.post('/login', LoginController.index);

routes.get('/categories', AuthMiddleware, CategoryController.index);
routes.post('/categories', AuthMiddleware, CategoryController.store);
routes.delete('/categories/:id', AuthMiddleware, CategoryController.delete);

module.exports = routes;
