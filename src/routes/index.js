const express = require('express')
const routes = express.Router()

const recipes = require('../app/controllers/visitorsController')

const management = require('./management')
const users = require('./users')
const chefs = require('./chefs')

routes.get('/', recipes.index)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/chefs', recipes.chefs)
routes.get('/chefs/:id', recipes.showChef)
routes.get('/recipes/search', recipes.search)
routes.get('/recipes/:id', recipes.show)

routes.use('/admin/chefs', chefs)
routes.use('/admin/users', management)
routes.use('/admin', users)

module.exports = routes