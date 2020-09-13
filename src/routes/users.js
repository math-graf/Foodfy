const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const recipesAdmin = require('../app/controllers/adminController')
const sessionController = require('../app/controllers/sessionController')
const profileController = require('../app/controllers/profileController')

const sessionValidator = require('../app/validators/session')
const adminValidator = require('../app/validators/admin')

const { redirectIfLogged, onlyUsers } = require('../app/middlewares/session')


/* ============= CONTROLE DE SESSÃO ============= */

routes.get('/login', redirectIfLogged, sessionController.loginForm)
routes.post('/login', sessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

/* ============= RECUPERAÇÃO DE SENHA ============= */

routes.get('/forgot-password', sessionController.forgotForm)
routes.get('/reset-password', sessionController.resetForm)
routes.post('/forgot-password', sessionValidator.forgot,  sessionController.forgot)
routes.post('/reset-password', sessionValidator.reset, sessionController.reset)

/* ============= PERFIL DE USUÁRIO ============= */

routes.get('/profile', profileController.index)
routes.put('/profile', adminValidator.update, profileController.put)

/* ============= EDIÇÃO DE RECEITAS ============= */

routes.get("/recipes", onlyUsers, recipesAdmin.index)
routes.get("/recipes/create", onlyUsers, recipesAdmin.create)
routes.get("/recipes/:id", recipesAdmin.show)
routes.get("/recipes/:id/edit", onlyUsers, recipesAdmin.edit)

routes.post("/recipes", multer.array('photos', 5), recipesAdmin.post)
routes.put("/recipes/:id", multer.array('photos', 5), recipesAdmin.put)
routes.delete("/recipes/:id", recipesAdmin.delete)

module.exports = routes