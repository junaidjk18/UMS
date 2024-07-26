const express = require('express')
const user_route= express()

const session = require('express-session')

const config = require('../config/config.js')
// user_route.use(session({secret:config.sessionSecret}))
const auth = require('../middleware/auth.js')

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));

const {validateInput,validateNewUser} = require('../middleware/validation.js');

// user_route.use(express.static('public'))

// const bodyParser = require('body-parser')
// user_route.use(bodyParser.json())
// user_route.use(bodyParser.urlencoded({extended:true}))


const userController =require ("../controllers/userController")

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',validateInput,userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginload)
user_route.get('/login',auth.isLogout,userController.loginload)

user_route.post('/login',userController.verifyLogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.post('/logout',auth.isLogin,userController.userLogout)

module.exports = user_route;