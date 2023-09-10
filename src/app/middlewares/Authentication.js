const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = async function(req, res, next) {

    const tokenBearer = req.headers.authorization;

    if(!tokenBearer) {
        return res.status(403).json({message: 'token not found'})
    }
    const [, token] = tokenBearer.split(' ');

    try {
        const responseTokenValidation = await jwt.verify(
            token,
            process.env.JWT_KEY
        );
        req.userId = responseTokenValidation.id;
        return next();
    } catch (err) {
        return res
            .status(401)
            .json({ message: 'you shall not pass' });
    }
}