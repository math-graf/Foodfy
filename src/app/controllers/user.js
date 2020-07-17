const User = require('../models/User')

module.exports = {
    index(req, res) {
        User.selectFeatured(function(recipes) {
            if (!recipes) return res.send('Receitas não encontradas!')
        
            return res.render('user/index', { recipes })
        })
    },
    about(req, res) {
        return res.render('user/about')
    },
    recipes(req, res) {
        let {page, limit, filter} = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit*(page - 1)

        const params = {
            page,
            limit,
            filter,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total/limit),
                    page
                }
                return res.render('user/recipes', { recipes, pagination, filter })
            }
        }
        User.paginate(params)
    },
    show(req, res) {
        User.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Receita não encontrada!')

            return res.render('user/view-recipe', { recipe })
        })
    },
    search(req, res) {
        let {page, limit, filter} = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit*(page - 1)

        const params = {
            page,
            limit,
            filter,
            offset,
            callback(recipes) {
                let pagination = {
                    total: 1,
                    page
                }
                if (recipes.length >= 1) {
                    pagination = {
                        total: Math.ceil(recipes[0].total/limit),
                        page
                    }
                }
                return res.render('user/search-recipes', { recipes, pagination, filter })
            }
        }
        User.paginate(params)
    }
}