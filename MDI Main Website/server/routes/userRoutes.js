const express = require('express');
const { getUserData } = require('../controllers/user-controller.js');
const userAuth = require('../middleware/userAuth.js');


const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

module.exports = userRouter;