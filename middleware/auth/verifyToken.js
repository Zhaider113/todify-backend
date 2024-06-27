var jwt = require('jsonwebtoken');
var config = require('../../config/jwtConfig');

function verifyToken(req, res, next) {

    var token = req.header('x-access-token')
    if (!token)
        return res.send({ success: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.send({ success: false, message: 'Failed to authenticate token. Login again please!' });

        // if everything good, save to request for use in other routes
        req.user = decoded;

        next();
    });
}

module.exports = verifyToken;