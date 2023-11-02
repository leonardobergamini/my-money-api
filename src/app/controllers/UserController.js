const bcrypt = require('bcrypt');
const UserService = require('../services/UserService');


class UserController {

    async store(req, res) {
        const { email, password, name } = req.body;

        if (!email) {
            return res.status(400).json({ 'message': 'email is required' });
        }

        if (!password) {
            return res.status(400).json({ 'message': 'password is required' });
        }

        if (!name) {
            return res.status(400).json({ 'message': 'name is required' });
        }

        const password_hash = bcrypt.hashSync(password, 6);
        const newUser = { name, email, password_hash };

        UserService.newUser(newUser)
            .then(() => {
                return res.status(201);
            })
            .catch(error => {
                if (error.toString() === 'user email already used') {
                    return res.status(400).json({ 'message': error });

                }
                return res.status(500).json({ 'message': error.toString() });
            })
    }
}

module.exports = new UserController();