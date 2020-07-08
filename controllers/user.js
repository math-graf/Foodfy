const data = require('../data.json')


exports.index = function(req, res) {
    return res.render('user/index', {items: data.recipes})
}

exports.about = function(req, res) {
    return res.render('user/about')
}

exports.recipes = function(req, res) {
    return res.render('user/recipes', {items: data.recipes})
}

exports.show = function(req, res) {
    const index = req.params.index

    return res.render('user/view-recipe', {item: data.recipes[index]})
}
