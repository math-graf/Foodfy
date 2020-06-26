const express = require('express')
const nunjucks = require('nunjucks')
const recipes = require('./data')

const server = express()

server.use(express.static('public'))
server.use(express.static('assets'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.get('/', function(req, res) {
    return res.render('index', {items:recipes})
})

server.get('/about', function(req, res) {
    return res.render('about')
})

server.get('/recipes', function(req, res) {
    return res.render('recipes', {items:recipes})
})

server.get('/recipes/:index', function(req, res) {
    const index = req.params.index

    return res.render('view-recipe', {item:recipes[index]})
})
  
server.listen(5000, function() {
    console.log("I'm listening")
})