const express = require("express")
const path = require("path")
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const flash = require('connect-flash')
const exphbs = require("express-handlebars")
const session = require('express-session')
const morgan = require("morgan")

const app = express()
const pagesRoutes = require("./routes/pages")
const apiRoutes = require("./routes/api")
const authRoutes = require("./routes/auth")
const cpRoutes = require("./routes/cp")
const { static } = require('express')
const config = require('./config')
const varMiddleware = require('./middleware/variables')


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}))


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(csrf())
app.use(flash())
app.set('trust proxy', 'loopback,uniquelocal')
app.use(express.static('public'))
app.use('/public/uikit', express.static(path.join(__dirname, 'modules', 'uikit', 'dist')))
app.use('/public/pikaday', express.static(path.join(__dirname, 'node_modules', 'pikaday')))
app.use(varMiddleware)
app.use(morgan('combined'))



app.use("/", pagesRoutes)
app.use("/api/", apiRoutes)
app.use("/auth/", authRoutes)
app.use("/cp/", cpRoutes)
module.exports = app