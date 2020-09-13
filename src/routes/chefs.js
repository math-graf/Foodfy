const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const recipesAdmin = require('../app/controllers/adminController')
const { onlyAdmins } = require('../app/middlewares/session')

routes.get('/', recipesAdmin.chefs)
routes.get('/create', onlyAdmins, recipesAdmin.createChef)
routes.get('/:id', recipesAdmin.showChef)
routes.get('/:id/edit', onlyAdmins, recipesAdmin.editChef)

routes.post("/", multer.array('photos', 1), recipesAdmin.postChef)
routes.put("/:id", multer.array('photos', 1), recipesAdmin.putChef)
routes.delete("/:id", recipesAdmin.deleteChef)

module.exports = routes