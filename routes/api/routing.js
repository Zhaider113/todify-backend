const express = require('express');
const AuthRoute = require('./authRoute');

const router = new express.Router();

router.use(AuthRoute);

module.exports = router;