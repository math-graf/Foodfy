const data = require('../data')


exports.index = function(req, res) {
    return res.render('user/index', {items: data})
}

exports.about = function(req, res) {
    return res.render('user/about')
}

exports.recipes = function(req, res) {
    return res.render('user/recipes', {items: data})
}

exports.show = function(req, res) {
    const index = req.params.index

    return res.render('user/view-recipe', {item: data[index]})
}
