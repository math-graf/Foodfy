const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/user')
const recipesAdmin = require('./app/controllers/admin')
const userController = require('./app/controllers/userController')
const profileController = require('./app/controllers/profileController')
const sessionController = require('./app/controllers/sessionController')
const adminValidator = require('./app/validators/admin')
const sessionValidator = require('./app/validators/session')
const { redirectIfLogged, onlyAdmins, onlyUsers } = require('./app/middlewares/session')

/* ===== USER ===== */

routes.get('/', recipes.index)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/chefs', recipes.chefs)
routes.get('/recipes/search', recipes.search)
routes.get('/recipes/:id', recipes.show)

/* ===== ADMIN ===== */

routes.get("/admin/recipes", recipesAdmin.index)
routes.get("/admin/recipes/create", recipesAdmin.create)
routes.get("/admin/recipes/:id", recipesAdmin.show)
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit)

routes.post("/admin/recipes", multer.array('photos', 5), recipesAdmin.post)
routes.put("/admin/recipes/:id", multer.array('photos', 5), recipesAdmin.put)
routes.delete("/admin/recipes/:id", recipesAdmin.delete)

routes.get('/admin/chefs', recipesAdmin.chefs)
routes.get('/admin/chefs/create', recipesAdmin.createChef)
routes.get('/admin/chefs/:id', recipesAdmin.showChef)
routes.get('/admin/chefs/:id/edit', recipesAdmin.editChef)

routes.post("/admin/chefs", multer.array('photos', 1), recipesAdmin.postChef)
routes.put("/admin/chefs/:id", multer.array('photos', 1), recipesAdmin.putChef)
routes.delete("/admin/chefs/:id", recipesAdmin.deleteChef)

// Rotas de login/logout
routes.get('/admin/login', redirectIfLogged, sessionController.loginForm)
routes.post('/admin/login', sessionValidator.login, sessionController.login)
routes.post('/admin/logout', sessionController.logout)

// Rotas para recuperação de senha
routes.get('/admin/forgot-password', sessionController.forgotForm)
routes.get('/admin/reset-password', sessionController.resetForm)
routes.post('/admin/forgot-password', sessionValidator.forgot,  sessionController.forgot)
routes.post('/admin/reset-password', sessionValidator.reset, sessionController.reset)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', profileController.index)
routes.put('/admin/profile', adminValidator.update, profileController.put)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', onlyUsers, adminValidator.show, userController.list)
routes.get('/admin/users/create', userController.create)
routes.get('/admin/users/edit/:id', onlyAdmins, userController.edit)
routes.post('/admin/users', adminValidator.post, userController.post)
routes.put('/admin/users', onlyAdmins, adminValidator.update, userController.put)
routes.delete('/admin/users', onlyAdmins, userController.delete)

module.exports = routes