
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
require('dotenv').config();


class LoginController {

    async index(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ 'message': 'email is required' });
        }

        if (!password) {
            return res.status(400).json({ 'message': 'password is required' });
        }

        UserService.findUser(email, password)
            .then(resp => {
                const user = {
                    id: resp.id,
                    name: resp.name,
                    email: resp.email,
                    token: jwt.sign({ id: resp.id }, process.env.JWT_KEY)
                }
                return res.status(200).json({ 'data': user })
            })
            .catch(err => {
                if (err.toString() === 'invalid user email or password') {
                    return res.status(401).json({ 'message': err })
                }

                return res.status(500).json({ 'messagem': err.toString() });
            })
    }
}

module.exports = new LoginController();