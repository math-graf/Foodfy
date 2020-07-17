const Admin = require('../models/Admin')

module.exports = {
    
    // ====== RECIPES ========
    
    index(req, res) {
        Admin.selectAllRecipes(function(recipes) {
            if (!recipes) return res.render('Receitas não encontradas!')

            return res.render('admin/recipes', { recipes })
        })
    },
    create(req, res) {
        return res.render('admin/create')
    }, 
    post(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }
        Admin.createRecipe(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    show(req, res) {
        Admin.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            return res.render('admin/view-recipe', { recipe })
        })
    },
    edit(req, res) {
        const id = req.params.id

        Admin.editRecipe(id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            return res.render('admin/edit', { recipe })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }
        Admin.updateRecipe(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })   
    },
    delete(req, res) {
        const id = req.body.id        

        Admin.deleteRecipe(id, function() {
            return res.redirect('/admin/recipes')
        })
    },

    // ====== CHEFS ========

    chefs(req, res) { 
        Admin.selectAllChefs(function(chefs) {
            if (!chefs) return res.send('Chefs não encontrados!')

            return res.render('admin/chefs', { chefs })
        })
    },
    createChef(req, res) {
        return res.render('admin/create-chef')
    },
    postChef(req, res) {
        Admin.createChef(req.body, function(chef) {
            if(!chef) return res.send('Chef não encontrado!')

            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    showChef(req, res) {
        Admin.findChef(req.params.id, function(chef) {
            if (!chef) return res.send('Chef não encontrado!')

            return res.render('admin/view-chef', { chef, chef_information: chef[0] })
        })
    },
    editChef(req, res) {
        Admin.inputChef(req.params.id, function(chef) {
            if (!chef) return res.send('Chef não encontrado!')

            return res.render(`admin/edit-chef`, {chef})
        })
    },
    putChef(req, res) {
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == '' && key != 'information') {
                return res.send('Por favor, preencha todos os campos.')
            }
        }
        console.log(req.body)
        Admin.updateChef(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    deleteChef(req, res) {
        Admin.removeChef(req.params.id, function() {
            return res.redirect('/admin/chefs')
        })
    }
}