// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ erro: 'Token inválido.' });
    }
}

module.exports = autenticarToken;
