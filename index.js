const mongoose = require('mongoose')
const session = require('express-session')
const nocache = require('nocache');

const dotEnv = require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)

const express = require('express')

const app = express()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true

}))

app.use(nocache())

const adminRoute=require('./routes/adminRoute')
app.use('/admin',adminRoute)

const userRoute=require('./routes/userRoute')
app.use('/',userRoute)

app.listen(process.env.PORT, (req, res) => {
    console.log('server running on http://localhost:3000');
})


