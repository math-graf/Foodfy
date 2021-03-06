const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes/index')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(express.static('assets'))
server.use(methodOverride('_method'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})
  
server.listen(5000, function() {
    console.log("I'm listening")
})