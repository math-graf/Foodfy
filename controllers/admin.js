const fs = require('fs')
const data = require('../data.json')


exports.index = function(req, res) {
    return res.render('admin/recipes', {items: data})
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

        return res.redirect('admin/recipes')
    })
}

exports.show = function(req, res) {
    const index = req.params.id

    return res.render('admin/view-recipe', {item: data[index]})
}

exports.edit = function(req, res) {
    return res.render('admin/edit', {items: data})
}

exports.put = function(req, res) {
    return res.render('index', {items: data})
}

exports.delete = function(req, res) {
    return res.render('index', {items: data})
}