const Admin = require('../models/Admin')
const File = require('../models/File')

module.exports = {
    
    // ====== RECIPES ========
    
    async index(req, res) {
        const { userId: id } = req.session

        const user = await Admin.findUser({ id: id })

        let results
        
        if (user.is_admin) {
            results = await Admin.selectAllRecipes()
        } else {
            results = await Admin.selectRecipesByUser(id)
        }
        const recipes = results.rows
            
        return res.render('admin/recipes', { recipes })
    },
    create(req, res) {
        return res.render('admin/create')
    }, 
    async post(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }

        if (req.files.length == 0) return res.send('Please, send at least one image.')

        req.body = {...req.body, id: req.session.userId}

        const results = await Admin.createRecipe(req.body)
        const recipe = results.rows[0]
        
        const filesPromise = req.files.map(file => File.create({...file, recipe_id: recipe.id}))
        await Promise.all(filesPromise)

        return res.redirect(`/admin/recipes/${recipe.id}`)
    },
    async show(req, res) {
        const results = await Admin.find(req.params.id)
        const recipe = results.rows[0]
        const recipePhotos = results.rows

        return res.render('admin/view-recipe', { recipe, recipePhotos })
    },
    async edit(req, res) {
        const id = req.params.id

        const results = await Admin.editRecipe(id)
        const recipe = results.rows[0]
        const files = results.rows

        return res.render('admin/edit', { recipe, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information' && key != 'removed_files') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({...file, recipe_id: req.body.id}))

            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        await Admin.updateRecipe(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)  
    },
    async delete(req, res) {
        const id = req.params.id

        await File.deleteAllFiles(id)
        await Admin.deleteRecipe(id)

        return res.redirect('/admin/recipes')
    },

    // ====== CHEFS ========

    async chefs(req, res) { 
        const results = await Admin.selectAllChefs()
        const chefs = results.rows

        return res.render('admin/chefs', { chefs })
    },
    createChef(req, res) {
        return res.render('admin/create-chef')
    },
    async postChef(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }

        if (req.files.length == 0) return res.send('Please, send at least one image.')

        const fileResults = await File.createChef(req.files[0].filename)

        const results = await Admin.createChef({...req.body, file_id: fileResults.rows[0].id})
        const chef = results.rows[0]

        return res.redirect(`/admin/chefs/${chef.id}`)
    },
    async showChef(req, res) {
        const results = await Admin.findChef(req.params.id)
        const chef = results.chef.rows[0]
        const chef_recipes = results.chef_recipes.rows

        return res.render('admin/view-chef', { chef, chef_recipes })
    },
    async editChef(req, res) {
        const results = await Admin.inputChef(req.params.id)
        const chef = results.rows[0]

        return res.render(`admin/edit-chef`, {chef})
    },
    async putChef(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }
        await Admin.updateChef(req.body)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async deleteChef(req, res) {
        await File.deleteChef(req.params.id)
        await Admin.removeChef(req.params.id)

        return res.redirect('/admin/chefs')
    }
}