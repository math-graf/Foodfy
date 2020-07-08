const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/user')
const recipesAdmin = require('./controllers/admin')

/* ===== USER ===== */

routes.get('/', recipes.index)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/recipes/:index', recipes.show)

/* ===== ADMIN ===== */

routes.get("/admin/recipes", recipesAdmin.index)
routes.get("/admin/recipes/create", recipesAdmin.create)
routes.get("/admin/recipes/:id", recipesAdmin.show)
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit)

routes.post("/admin/recipes", recipesAdmin.post)
routes.put("/admin/recipes/:id", recipesAdmin.put)
routes.delete("/admin/recipes/:id", recipesAdmin.delete)


module.exports = routes