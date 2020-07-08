const fs = require('fs')
const data = require('../data.json')


exports.index = function(req, res) {
    return res.render('admin/recipes', {items: data.recipes})
}

exports.create = function(req, res) {
    return res.render('admin/create')
}

exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == '' && key != 'information') {
            return res.send('Por favor, preencha todos os campos.')
        }
    }

    data.recipes.push(req.body)

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error!')

        return res.redirect('/admin/recipes')
    })
}

exports.show = function(req, res) {
    const index = req.params.id

    return res.render('admin/view-recipe', {item: data.recipes[index], id:index})
}

exports.edit = function(req, res) {
    const index = req.params.id

    return res.render('admin/edit', {item: data.recipes[index], id: index})
}

exports.put = function(req, res) {
    const index = req.params.id
    console.log(index)
    const foundRecipe = data.recipes[index]

    const recipe = {
        ...foundRecipe,
        ...req.body
    }

    data.recipes[index] = recipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error!')

        return res.redirect(`/admin/recipes/${index}`)
    })
}

exports.delete = function(req, res) {
    const { index } = req.body
    
    const filteredRecipes = data.recipes.filter(function(recipe) {
        return recipe.index != index
    })

    data.recipes = filteredRecipes

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error!')

        return res.redirect('/admin/recipes')
    })
}