const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/user')
const recipesAdmin = require('./app/controllers/admin')

/* ===== USER ===== */

routes.get('/', recipes.index)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/recipes/search', recipes.search)
routes.get('/recipes/:id', recipes.show)

/* ===== ADMIN ===== */

routes.get("/admin/recipes", recipesAdmin.index)
routes.get("/admin/recipes/create", recipesAdmin.create)
routes.get("/admin/recipes/:id", recipesAdmin.show)
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit)

routes.post("/admin/recipes", recipesAdmin.post)
routes.put("/admin/recipes/:id", recipesAdmin.put)
routes.delete("/admin/recipes/:id", recipesAdmin.delete)

routes.get('/admin/chefs', recipesAdmin.chefs)
routes.get('/admin/chefs/create', recipesAdmin.createChef)
routes.get('/admin/chefs/:id', recipesAdmin.showChef)
routes.get('/admin/chefs/:id/edit', recipesAdmin.editChef)

routes.post("/admin/chefs", recipesAdmin.postChef)
routes.put("/admin/chefs/:id", recipesAdmin.putChef)
routes.delete("/admin/chefs/:id", recipesAdmin.deleteChef)

module.exports = routes