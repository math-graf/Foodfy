const express = require('express')
const routes = express.Router()

const adminValidator = require('../app/validators/admin')
const { onlyAdmins } = require('../app/middlewares/session')

const userController = require('../app/controllers/userController')

routes.get('/', onlyAdmins, adminValidator.show, userController.list)
routes.get('/create', userController.create)
routes.get('/edit/:id', onlyAdmins, userController.edit)
routes.post('/', adminValidator.post, userController.post)
routes.put('/', onlyAdmins, adminValidator.update, userController.put)
routes.delete('/', onlyAdmins, userController.delete)

module.exports = routes